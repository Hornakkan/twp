<script setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="post" draggable="true">
    <input type="hidden" v-model="postId">
    <div class="post--details">
      <p class="post--details--content">
        <RouterLink :to="'/note/' + postId">
            <slot name="post--content"></slot>
        </RouterLink>        
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    postId: Number
  },
  methods: {
    test() {
      // console.log("Post ID: ", this.postId);
    }
  }
}
</script>