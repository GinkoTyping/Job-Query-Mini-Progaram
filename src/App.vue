<script>
import { useStore } from "vuex";
const store = useStore();

export default {
  onLaunch: function () {
    this.$store.dispatch("getSystemInfo");
  },
  onShow: function () {
  },
  onHide: function () {
  },
};
</script>

<style>
@import "animate/animate.css";
</style>
