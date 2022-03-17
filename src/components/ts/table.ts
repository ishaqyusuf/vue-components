import {
  computed,
  defineComponent,
  h,
  inject,
  InjectionKey,
  provide,
  reactive,
  ref,
  useSlots,
} from "vue";
import TableCheckbox from "../TableCheckbox.vue";
let _ = reactive({
  list: null,
});
let TableContext = Symbol("TableContext") as InjectionKey<any>;
export let useTableContext = (component: string) => {
  let context = inject(TableContext, null);
  return context;
};

let useRowCtx = (id, list) => {
  return {
    id,
    data: list.itemsById[id],
    checked: computed(() => list.checkedIds.includes(id)),
  };
};
export let Table = defineComponent({
  props: {
    list: { type: Object, required: true },
    as: { type: [Object, String], default: "table" },
    dense: Boolean,
    condensed: Boolean,
    checkable: Boolean,
    select: Boolean,
  },
  name: "v-table",
  setup(props, { emit, slots: s, attrs }) {
    let api = {
      list: props.list,
      dense: computed(() => props.dense),
      condensed: computed(() => props.condensed),
      select: computed(() => props.select),
      checkable: computed(() => props.checkable),
      ctx: reactive({
        columns: [] as any,
      }),
    };
    provide(TableContext, api);
    let slots = useSlots();
    return () => {
      let slot = {
        open: true,
      };
      return h(
        "table",
        {
          class: {
            "border border-collapsed rounded-lg": true,
          },
        },
        [slots.default && slots.default()]
      );
    };
  },
});
export let Tr = defineComponent({
  props: {},
  setup(props, ctx) {
    let api = useTableContext("x-tr");
    let slots = useSlots();
    return () => [
      ...api.list.ids.map((id) => {
        return h(
          "tr",
          {
            class: {
              "border border-gray-100": true,
              "hover:bg-gray-100": api.select.value,
              // "cusor-": props.select,
            },
          },
          [
            api.checkable.value &&
              h(Td, {
                check: true,
                itemId: id,
                class: {
                  // "w-16": true,
                },
              }),
            slots.tr &&
              slots.tr({
                ...useRowCtx(id, api.list),
              }),
          ]
        );
      }),
    ];
  },
});
export let Tcell = defineComponent({
  props: {
    as: {
      default: "div",
      type: String,
    },
    primary: Boolean,
    strong: Boolean,
  },
  setup(props, { slots }) {
    let api = useTableContext("x-td");
    return () =>
      h(
        props.as,
        {
          class: {
            "text-gray-600": props.primary && !props.strong,
            "font-semibold": props.primary,
            "text-gray-500": !props.primary,
          },
        },
        [slots.default && slots.default()]
      );
  },
});
export let Td = defineComponent({
  props: {
    action: Boolean,
    title: String,
    subtitle: String,
    primary: Boolean,
    right: Boolean,
    center: Boolean,
    secondary: Boolean,
    check: Boolean,
    tertiary: Boolean,
    itemId: String,
  },
  setup(props, ctx) {
    let api = useTableContext("x-td");
    return () =>
      h(
        "td",
        {
          class: {
            ...orientation(props),
            "cursor-pointer": api.select.value && !props.check && !props.action,
            "p-2 pl-4 text-sm": api.dense.value,
          },
        },
        props.check
          ? h(TableCheckbox, {
              itemId: props.itemId,
            })
          : ctx.slots
      );
  },
});
let orientation = (props) => {
  return {
    "text-left": !props.center && !props.right,
    "text-center": props.center,
    "text-right": props.right,
  };
};
let Checkbox = defineComponent({
  props: {
    modelValue: Boolean,
    all: Boolean,
    itemId: String,
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    let api = useTableContext("check-box");
    // let mv = computed({
    //   get() {
    //     return true;
    //   },
    //   set(v) {
    //     console.log(v);
    //   },
    // });
    let mv = ref(false);
    return () =>
      h("input", {
        type: "checkbox",
        class: {
          "cursor-pointer": true,
        },
        checked: mv,
        onInput(e) {
          console.log(e.target.value);
        },
        // onInput: (e) => {
        //   ctx.emit("update:modelValue", e.target.value);
        //   console.log(mv.value);
        // },
        // value: mv.value,
      });
  },
});

export let Th = defineComponent({
  props: {
    action: Boolean,
    center: Boolean,
    right: Boolean,
    check: Boolean,
    sort: String,
  },
  setup(props, ctx) {
    let api = useTableContext("x-th");
    return () =>
      h(
        "th",
        {
          class: {
            ...orientation(props),
            "p-2 pl-4 text-sm": api.dense.value,
          },
        },
        props.check ? h(TableCheckbox, {}) : ctx.slots
      );
  },
});

// export let Tr = defineComponent({
//   props: {
//     as: {
//       type: String,
//       default: "tr",
//     },
//     id: [String, Object, Number],
//   },
//   setup(props, { emit, slots, attrs }) {
//     let propsWeControl = {};

//     let api = useTableContext("VTr");
//     let slot = {
//       item: ref({}),
//       hover: ref(false),
//       selected: ref(false),
//     };
//     if (props.id) {
//       slot.item.value = api.itemsById[props.id as any];
//     }
//     return () => {
//       return render({
//         props: { ...props, propsWeControl },
//         slot,
//         attrs,
//         slots,
//         name: "Tr",
//       });
//     };
//   },
// });
// export let Td = defineComponent({
//   props: {
//     as: {
//       type: String,
//       default: "td",
//     },
//   },
//   setup(props, { emit, slots, attrs }) {
//     let propsWeControl = {};
//     let slot = { text: "Hello World" };

//     return () => {
//       return render({
//         props: { ...props, propsWeControl },
//         slot,
//         attrs,
//         slots,
//         name: "VTd",
//       });
//     };
//   },
// });
export let Thead = defineComponent({
  props: {
    as: {
      type: String,
      default: "thead",
    },
  },
  setup(props, ctx) {
    let propsWeControl = {};
    // let slot = { text: "Hello World" };
    let api = useTableContext("x-thead");
    return () =>
      h(
        "thead",
        {
          class: {
            "bg-gray-100 bg-opacity-70 text-gray-600": true,
            "p-2 text-sm": api.dense.value,
          },
        },
        [
          api.checkable.value &&
            h(Th, {
              check: true,
              all: true,
              class: {
                "w-10": true,
              },
            }),
          ctx.slots.default && ctx.slots.default(),
        ]
      );
  },
});
// export let Th = defineComponent({
//   props: {
//     as: {
//       type: String,
//       default: "th",
//     },
//     center: Boolean,
//     right: Boolean,
//     sort: String
//   },
//   setup(props, { emit, slots, attrs }) {
//     let propsWeControl = {};
//     let slot = { text: "Hello World" };
//     return () => {
//       return render({
//         props: { ...props, propsWeControl },
//         slot,
//         attrs,
//         slots,
//         name: "v-th",
//       });
//     };
//   },
// });
