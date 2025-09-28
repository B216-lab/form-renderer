<script>
import { useVueform, Vueform } from '@vueform/vueform'
import { schema } from './schema'

export default {
  mixins: [Vueform],
  setup: useVueform,
  data: () => ({
    vueform: {
      size: 'md',
      displayErrors: false,
      schema: schema,
    }
  })
}
</script>
