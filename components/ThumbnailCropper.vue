<template>
  <div class="d-flex g-4" style="gap: 4px">
    <button
      type="button"
      class="m-btn icon-btn h-100"
      title="upload"
      @click="toggleShow"
    >
      <i class="fi fi-rr-arrow-up-from-square"></i>
    </button>

    <my-upload
      field="file"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="show"
      :width="100"
      :height="100"
      :url="url"
      lang-type="vi"
      :params="params"
      :headers="headers"
      img-format="png"
    ></my-upload>
    <img :src="imgDataUrl" width="36" height="36" v-show="imgDataUrl != ''" />
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload/upload-2.vue'
export default {
  components: {
    'my-upload': myUpload,
  },
  props: {
    value: String,
  },
  data() {
    return {
      show: false,
      params: {},
      headers: {
        smail: '*_~',
      },
      imgDataUrl: '', // the datebase64 url of created image
      imgUploadedUrl: '',
    }
  },
  computed: {
    url() {
      return this.$config.apiUrl + this.$api.uploadSingleImage
    },
  },
  mounted() {
    // this.log('Thumbnail cropper mounted')
    this.imgDataUrl = this.value ? this.thumbnail(this.value) : ''
  },
  methods: {
    toggleShow() {
      this.show = !this.show
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field) {
      this.log('-------- crop success --------')
      this.imgDataUrl = imgDataUrl
    },
    /**
     * upload success
     *
     * [param] jsonData  server api return data, already json encode
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      this.log('-------- upload success --------')
      this.log(jsonData)
      this.imgUploadedUrl = jsonData.filePath
      this.$emit('input', this.imgUploadedUrl)
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      this.log('-------- upload fail --------')
      this.log(status)
      this.log('field: ' + field)
    },
  },
}
</script>

<style></style>
