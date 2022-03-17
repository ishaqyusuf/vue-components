import { defineComponent } from "vue";

export let XTable = defineComponent({
    props: {},
    render() {
        return <table className="w-full">
            <slot></slot>
        </table>
    }
})
export let XThead = defineComponent({
    props:{},
    render() {
        return <thead>
          <x-tr>
              {
          ...{
            scopedSlots: {
              default: ({ item }) => <span>{ item.foo }</span>
            }
          }
        }
              <slot/>
          </x-tr>
        </thead>
    }
})
export let XTh = defineComponent({
    props:{},
    render() {
        return <th>
         
              <slot/>
        </th>
    }
})
export let XTr = defineComponent({
    props:{},
    render() {
        return <tr>
            <slot/>
        </tr>
    }
})

export let XTd = defineComponent({
    props:{},
    render() {
        return <td>
            <slot/>
        </td>
    }
})