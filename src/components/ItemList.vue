<template>
  <div class="list">
    <div class="list--details">
      <h3 class="list--details--title" contenteditable="true" @blur="updateList">
        <slot name="list--title"></slot>
      </h3>
      <p class="list--details--content">
      <input type="hidden" id="list--details--hidden" v-model="listId" />
        <slot name="list--content"></slot>
      </p>
    </div>
    <div class="list--footer">
      <slot name="list--add"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listId: Number
  },
  data() {
    return {
      listName: ''
    }
  },
  mounted() {

  },
  methods: {
    updateList() {
      let listTitle = event.target;

      if(localStorage.getItem('jwt') && listTitle.innerText != '') {
        // màj du title de la catégorie
          let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/categories/' + this.listId;
          fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            method: 'POST',
            body: JSON.stringify({
              name: listTitle.innerText,
              slug: listTitle.innerText.toLocaleLowerCase()
            })
          })
          .then(response => {
            // console.log(response);
          })
          .catch(error => {
            console.error(error);
          })
      }      
    }
  }
}
</script>