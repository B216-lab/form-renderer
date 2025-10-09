<script>
import { ref } from 'vue'
import { useVueform, Vueform } from '@vueform/vueform'
import { schema } from './schema'

export default {
  mixins: [Vueform],
  setup(props, context)
  {
    const form = useVueform(props, context)

    const vueform = ref(schema)

    return {
      ...form,
      vueform,
    }
  }
}
</script>
