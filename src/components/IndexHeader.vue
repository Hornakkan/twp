<template>
  <div class="post-it--count">
    <input type="hidden" name="">
    <!-- <span v-if="postCount > 1">You have {{ postCount }} tasks left</span>
    <span v-else-if="postCount == 1">Good job, only {{ postCount }} task remaining</span>
    <span v-else="postCount">Congratulations all tasks done !</span> -->
  </div>
</template>

<script>
export default {
  props: {
    postCount: Number
  }
}
</script>