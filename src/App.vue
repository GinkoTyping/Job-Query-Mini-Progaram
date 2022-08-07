<script>
import { useStore } from "vuex";
const store = useStore();

export default {
  onLaunch: function () {
    this.$store.dispatch("getUserInfo");
    this.$store.dispatch("getSystemInfo");
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
@import "animate/animate.css";
</style>
