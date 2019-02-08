<template>
  <footer class="footer">
    <div class="container-fluid">
      <!-- <ul class="nav">
        <li class="nav-item">
          <a href="http://iasdigitalgroup.com/" target="_blank" rel="noopener" class="nav-link">
            {{$t("footer.company")}}
          </a>
        </li>
        <li class="nav-item">
          <a href="http://iasdigitalgroup.com/#who" target="_blank" rel="noopener" class="nav-link">
            {{$t("footer.aboutus")}}
          </a>
        </li>
      </ul> -->
      <div class="copyright">
        &copy; {{ year }}, {{$t("footer.copyrightphrase1")}}<i class="tim-icons icon-heart-2"></i> {{$t("footer.copyrightphrase2")}}
        <a href="http://rebens.com.br" target="_blank">{{$t("footer.company")}}</a>
        {{$t("footer.copyrightphrase3")}}
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style>
</style>
