import {
  computed,
  defineComponent,
  h,
  inject,
  reactive,
  ref,
  watch,
  withCtx,
} from "vue";
import { useId } from "../../utils/use-id";
import { useDebouncedWithWatch } from "../../utils/use-debounce";
import { inputProps } from "./props";

let useInput = (props, slots, emit, form) => {
  let ctx = reactive({
    props,
    slots,
    id: "input-" + useId(),
    list: null as any,
    multiple: props.selection > 1,
    selection: [],
    inputRef: ref({}),
    simple: true,
    mode: "Input" as
      | "Input"
      | "Autocomplete"
      | "SearchInput"
      | "Select"
      | "Combobox",
    _validatedModel: null,
    _model: {
      text: null,
      data: null,
      value: null,
      validated: null,
    },
    beforeFocus: null as any,
    onFocus: null as any,
    beforeBlur: null as any,
    onBlur: null as any,
    onInput: null as any,
    preventBlur: false,
    _onFocus: () =>
      setTimeout(() => {
        ctx.onFocus && ctx.onFocus();
        ctx.focused = true;
      }, 200),
    _onBlur: (e) =>
      setTimeout(() => {
        ctx.onBlur && ctx.onBlur(e);
        if (ctx.preventBlur) {
          e.preventDefault();
          document.getElementById(ctx.id)?.focus();
          ctx.preventBlur = false;
        } else ctx.focused = false;
      }, 200),
    _onInput: (v) => {
      //   console.log("....");
      if (ctx.onInput) ctx.onInput(v);
      else {
        // console.log("...");
        if (ctx.simple) {
          ctx._model.text = ctx._model.value = v;
          ctx.setValue();
        }
      }
      //  emit("update:modelValue", e.target.value);
    },
    emit,
    focused: false,
    getValue: () => {
      return form && props.name ? form[props.name] : props.modelValue;
    },
    unwatch(time = 1000) {
      this._watching = false;
      setTimeout(() => {
        this._watching = true;
      }, time);
    },
    setValue() {
      if (props.selection > 1) {
        ctx._model.value = ctx.list.value();
      }
      let value = ctx._model.value;
      this.unwatch();
      if (form && props.name) {
        form[props.name] = value;
      } else emit("update:modelValue", value);
    },
    _watching: true,

    _selectItem(obj, silent = false) {
      if (props.onSelect) props.onSelect(obj, ctx);
      else {
        if (props.dtf) {
          Object.entries(obj.data)?.map(([k, v]) => {
            form[k] = v;
            console.log([k, v]);
          });
          return;
        }
        if (props.selection > 1 && obj?.text) {
          ctx.preventBlur = true;
          ctx._model.text = "";

          ctx.list.select(obj);
          ctx._model.value = ctx.list.value();
        } else {
          ctx._model = ctx._validatedModel = obj ?? {};
        }
        // ctx._model.validated = value;
        if (!silent) ctx.setValue();
      }
    },
    init() {
      let m = ctx.getValue();
      ctx.list._init();
      if (!props.itemText || !props.itemValue) {
        if (props.selection == 1) ctx._validatedModel = ctx._model.text = m;
        // else ctx.list.
        // console.log(["Simple", m]);
      }
    },
  });
  ctx.list = simpleList(ctx);
  watch(
    () => ctx._model,
    () => {
      if (ctx.mode == "SearchInput") {
        console.log("Updated");
      }
    }
  );
  watch(
    () => ctx.getValue(),
    (value, old) => {
      if (!ctx._watching) return;
      if (!props.itemText || !props.itemValue) {
        if (props.selection == 1) ctx._validatedModel = ctx._model.text = value;
        else ctx.list.resetInput(true);
      } else ctx.list.resetInput(true);
    }
  );
  return ctx;
};

export let Input = defineComponent({
  props: inputProps(),
  setup(props, { slots, emit }) {
    let form = FormContext();
    let ctx = useInput(props, slots, emit, form);
    ctx.init();
    return () => InputComponent(ctx);
  },
});
export let Autocomplete = defineComponent({
  props: inputProps(),
  setup(props, { slots, emit }) {
    let form = FormContext();
    let ctx = useInput(props, slots, emit, form);
    ctx.simple = false;
    ctx.mode = "Autocomplete";
    ctx.init();
    ctx._onInput = (e) => {};
    ctx.onBlur = (e) => {
      if (props.selection == 1) {
        //   ctx._selectItem(ctx._validatedModel);
      }
    };
    return () => InputComponent(ctx);
  },
});
let dummyApi = (length = 10) => {
  return Array(length)
    .fill(1)
    .map((d) => {
      let id = useId();
      return {
        name: "User " + id,
        address: `No ${id} Adewole Estate`,
        email: `ishaqyusuf0${id}@gmail.com`,
        country: "Nigeria",
        prefix: "+234",
        state: "Kwara State",
        city: "Ilorin",
      };
    });
};
export let SearchInput = defineComponent({
  props: inputProps(),
  setup(props, { slots, emit }) {
    let form = FormContext();
    let ctx = useInput(props, slots, emit, form);
    ctx.mode = "SearchInput";
    let searchInput = useDebouncedWithWatch("", (value) => {
      ctx.list.expand(dummyApi(10), false);
    });
    ctx._onInput = (e) => {
      searchInput.value = e;
      ctx._model.text = ctx._model.value = e;
      ctx.setValue();
      console.log(e);
    };

    return () => InputComponent(ctx);
  },
});
let InputClass = ({ props }) => {
  return {};
};
let FormContext = () => {
  return inject<any>("x-form");
};
let InputContext = () => {
  return inject<any>("x-input");
};

let InputComponent = (ctx) => {
  return h(
    "div",
    {
      class: {
        "text-sm": !ctx.props.dense,
        "relative ": true,
      },
    },
    [
      _Label(ctx),
      h(
        "div",
        {
          class: {
            "rounded-lg ": !ctx.props.tile,
            "ring-2": ctx.focused,
            "border border-gray-300": true,
          },
        },
        [
          h(
            "div",
            {
              class: {
                flex: true,
                // "items-center": !ctx.list.hasSelection,
                "flex-wrap": ctx.list.hasSelection,
              },
            },
            [_Prefix(ctx), _Selection(ctx), _Input(ctx), _Suffix(ctx)]
          ),
        ]
      ),
      items(ctx),
    ]
  );
};
let _Prefix = ({ props, slots, ...ctx }) => {
  return slots.prepend
    ? slots.prepend({})
    : props.prefix
    ? h(
        "div",
        {
          class: {
            "pl-1.5 ": !props.addOn,
            "flex font-semibold items-center": true,
            "px-3 flex bg-gray-200 border-r border-gray-300": props.addOn,
          },
        },
        props.prefix
      )
    : null;
};
let _Suffix = ({ props, slots, ...ctx }) => {
  return slots.append
    ? slots.append({})
    : props.suffix
    ? h(
        props.addOn ? "div" : "span",
        {
          class: {
            "pr-1.5 ": !props.addOn,
            "flex font-semibold items-center": true,
            "px-3 flex bg-gray-200 border-l border-gray-300": props.addOn,
          },
        },
        props.suffix
      )
    : null;
};
let _Label = (ctx) => {
  return ctx.slots.label
    ? ctx.slots.label()
    : ctx.props.label
    ? h(
        "div",
        {
          class: {
            "font-semibold mx-1 mb-2": true,
          },
        },
        ctx.props.label
      )
    : null;
};
let _Input = ({ props, slots, ...ctx }) => {
  return slots.input
    ? slots.input()
    : h(
        "div",
        {
          class: {
            "inline-flex flex-1": true,
          },
        },
        [
          h("input", {
            ref: ctx.inputRef,
            refInFor: true,
            name: props.name,
            id: ctx.id,
            class: {
              "pr-6": ctx.list.hasSelection,
              "": !ctx.list.hasSelection,
              "focus:outline-none bg-transparent w-full": true,
              "p-1 text-sm": props.dense,
              "py-1.5": !props.dense,
              "pr-2": !slots.append && !props.suffix,
              "pl-2": !slots.append && !props.prefix,
            },
            value: ctx._model.text,
            onFocus: ctx._onFocus,
            onBlur: ctx._onBlur,
            onInput: (e) => ctx._onInput(e.target.value),
          }),
        ]
      );
};

let simpleList = (ctx) => {
  let _itemValue = (item, k) => {
    // if (k) console.log(item[k]);
    if (typeof item === "object" && k) return item[k];
    return item;
  };
  let _ = reactive({
    items: [],
    selection: [],
    hasSelection: computed(() => _.selection?.length > 0),
    _init() {
      this.init(ctx.props.items);
      watch(
        () => ctx.props.items,
        (k, v) => this.init(k)
      );
    },
    value() {
      return this.selection?.map((i) => i?.value);
    },
    resetInput(force = false) {
      let val = ctx.getValue();
      if ((val && !ctx._validatedModel) || force) {
        if (ctx.props.selection > 1) {
          _.selection = [];
          (val ?? []).map((v) => {
            let _value = _.find(v);
            if (_value) ctx._selectItem(_value, true);
          });
          return;
        }
        let m = _.find(val);
        // console.log(m);
        if (m) ctx._selectItem(m, true);
        // }
      }
    },
    isSelected(item) {
      return this.selection.indexOf(item) > -1;
    },
    onSelect(item) {
      this.select(item);
      ctx.setValue();
    },
    select(item) {
      if (this.isSelected(item)) this.remove(item);
      else this.selection.push(item);
      //   ctx.setValue();
    },
    remove(item) {
      let index = this.selection.indexOf(item);
      //   console.log(index);
      if (index > -1) this.selection.splice(index, 1);
      //   ctx.setValue();
    },
    find(value) {
      return _.items?.find((i) => i.value == value);
    },
    expand(items) {
      let { itemText, itemValue } = ctx.props;
      let _items = items.map((item) => {
        return {
          data: item,
          text: _itemValue(item, itemText),
          value: _itemValue(item, itemValue),
        };
      });
      _.items = _items;
    },
    init: (items, reset = true) => {
      let { itemText, itemValue } = ctx.props;
      _.items = items?.map((item) => {
        return {
          data: item,
          text: _itemValue(item, itemText),
          value: _itemValue(item, itemValue),
        };
      });
      if (reset) {
        _.resetInput();
      }
    },
  });
  return _;
};
let _Selection = (ctx) => {
  if (!ctx.list.hasSelection) return;
  //   console.log(ctx.list.selection?.map((s) => s?.text));
  return ctx.list.selection?.map((item) =>
    ctx.slots.selection
      ? ctx.slots.selection(item)
      : h(
          "button",
          {
            onClick: (e) => ctx.list.remove(item),
            class: {
              "bg-orange-200 hover:bg-orange-300 m-1": true,
              "rounded-lg inline-flex justify-center items-center text-sm px-1":
                true,
            },
          },
          [
            ctx.slots.selectionText
              ? ctx.slots.selectionText({
                  ...item,
                })
              : ctx.slots.itemText
              ? ctx.slots.itemText({
                  ...item,
                })
              : h("span", {}, item?.text),
            h(
              "span",
              {
                class: {
                  "px-1.5": true,
                },
              },
              "x"
            ),
          ]
        )
  );
  return null;
};
let items = ({ list, slots, ...ctx }) => {
  //   let { slots } = ctx;
  //   ctx.list = simpleList(ctx);
  //   list._init();
  //   return null;
  if (ctx.focused && list.items?.length > 0) {
    return h(
      "div",
      {
        class: {
          "absolute origin-bottom-left mt-1 z-10 w-fulls bg-white border shadow-lg rounded-lg":
            true,
        },
      },
      [
        h(
          "div",
          {
            class: {
              "max-h-48 shadow-lg overflow-auto": true,
            },
          },
          [
            list.items.map((_item) =>
              slots.item
                ? slots.item(_item)
                : h(
                    "button",
                    {
                      onClick: (e) => {
                        ctx._selectItem(_item);
                      },
                      class: {
                        "bg-purple-100": list.isSelected(_item),
                        "hover:bg-purple-400": !list.isSelected(_item),
                        "p-1 w-full text-left ": true,
                      },
                    },
                    slots.itemText ? slots.itemText(_item) : _item.text
                  )
            ),
          ]
        ),
      ]
    );
  }

  return null;
};
