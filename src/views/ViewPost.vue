<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
</script>

<template>
  <div class="view--wrapper">
    <!-- <h3 class="view--message">(feel free to edit your card's details below)</h3> -->
    <div class="view-post">
      <div class="view-post--details">
        <h3 v-if="postDetails.author == this.loggedUser" class="view-post--details--title" aria-label="post title" contenteditable="true" @blur="updateTitle">
          {{ postDetails.title }}
        </h3>
        <h3 v-else class="view-post--details--title" aria-label="post title">
          {{ postDetails.title }}
        </h3>
        <p v-if="postDetails.author == this.loggedUser" class="view-post--details--content" aria-label="post content" contenteditable="true" @blur="updateContent">
          {{ postDetails.content }}
        </p>
        <p v-else class="view-post--details--content" aria-label="post content">
          {{ postDetails.content }}
        </p>
      </div>
      {{ warningMessage }}
      <div class="view-post--footer">
        <RouterLink to="/" aria-label="back to the index page button"><button>Back</button></RouterLink>
        <button v-if="postDetails.author == this.loggedUser" @click="deleteCard">Delete card</button>
      </div>
    </div>

    <div class="view-comment">
      <div class="view-comment--new">
        <input type="text" class="view-comment--new--content" @keyup.enter="addComment" placeholder="new comment ...">
        <button @click="addComment">Add comment</button>
      </div>

      <div class="view-comment--comments" v-for="postComment in postComments">
        <p v-if="postComment.author == this.loggedUser" @blur="updateComment(postComment.id)" class="view-comment--comments--content" aria-label="comment content" contenteditable="true">
          {{ postComment.content.rendered.replace(/(<([^>]+)>)/gi, "") }}
        </p>
        <p v-else class="view-comment--comments--content" aria-label="comment content">
          {{ postComment.content.rendered.replace(/(<([^>]+)>)/gi, "") }}
        </p>
        <p class="view-comment--comments--footer">
          <p class="view-comment--comments--footer--author">by {{ postComment.author_name }}</p>
          <p class="view-comment--comments--footer--date">on {{ postComment.date.split('T')[0] }}</p>
          <p class="view-comment--comments--footer--hour">at {{ postComment.date.split('T')[1] }}</p>
        </p>
        <button v-if="postComment.author == this.loggedUser" @click="deleteComment(postComment.id)">Delete comment</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      warningMessage: '',
      loggedUser: localStorage.getItem('userid') ? localStorage.getItem('userid') : 0,
      postComments: [],
      postDetails: {
        title: '',
        content: '',
        author: 0,
        date: [],
        categories: [],
        id: ''
      }
      }
  },
  mounted() {
    // récupération de l'id attaché à la route
    // filtrage des post et récupération de celui dont l'id match au param
    const route = useRoute(); 
    let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/posts';
    fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        data.forEach(singlePost => {
          if(singlePost.id == route.params.id) {
              this.postDetails.title = singlePost.title.rendered;
              this.postDetails.content = singlePost.content.rendered.replace(/(<([^>]+)>)/gi, "");
              this.postDetails.categories = singlePost.categories;
              this.postDetails.author = singlePost.author;
              this.postDetails.date = singlePost.date.split('T');
              this.postDetails.id = singlePost.id;
          }
        });
      })
      .then( () => this.loadComments() )
      .catch(error => {
        console.error(error);
      })
  },
  methods: {
// ----------------------
// adding methods
// ----------------------  
    addComment() {
      if (document.querySelector('.view-comment--new--content').value != '') {
        let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/comments/';
        fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            content: document.querySelector('.view-comment--new--content').value,
            post: this.postDetails.id,
            author: localStorage.getItem('userid'),
            author_name: localStorage.getItem('usernice'),
            status: 'approved'
          }),        
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`          
          }
        })
        .then( () => {
          document.querySelector('.view-comment--new--content').value = '';
          this.loadComments();
        })
      }
    },
// ----------------------
// loading methods
// ----------------------      
    loadData(title, content) {
      this.postDetails.title = title;
      this.postDetails.content = content;
    },    
    loadComments() {
    let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/comments';
    fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        return response.json();
      })
      .then(comments => {
        this.postComments = comments.filter(comment => comment.post == this.postDetails.id);
      })
      .catch(error => {
        console.error(error);
      })
    },
// ----------------------
// updating methods
// ----------------------      
    updateTitle(event) {
      let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/posts/' + this.postDetails.id;
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`          
        },
        method: 'POST',
        body: JSON.stringify({
          title: event.target.innerText,
          content: this.postDetails.content,
          excerpt: this.postDetails.content,
          slug: event.target.innerText.toLocaleLowerCase(),
          status: 'publish'
        })
      })
      .then( () => {
        this.loadData(event.target.innerText, this.postDetails.content);
      })
      .catch(error => {
        console.error(error);
      })                 
    },
    updateContent(event) {  
      let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/posts/' + this.postDetails.id;
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`          
        },
        method: 'POST',
        body: JSON.stringify({
          title: this.postDetails.title,
          content: event.target.innerText,
          excerpt: event.target.innerText,
          slug: event.target.innerText.toLocaleLowerCase(),
          status: 'publish'
        })
      })
      .then( () => {
        this.loadData(this.postDetails.title, event.target.innerText);
      })
      .catch(error => {
        console.error(error);
      })               
    },
    updateComment(commentId) {
      let commentContent = event.target.innerText;
      let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/comments/' + commentId;
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`          
        },
        method: 'POST',
        body: JSON.stringify({
          content: commentContent,
        })
      })
      .then( () => {
        this.loadComments();
      })
      .catch(error => {
        console.error(error);
      })       
    },
// ----------------------
// deleting methods
// ----------------------          
    deleteComment(commentId){
      let url = `http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/comments/${commentId}?force=true`;
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        method: 'DELETE'
      })
      .then(() => {
        this.loadComments();   
      })
      .catch(error => {
        console.error(error);
      })
    },
    deleteCard() {
      // suppression des commentaires rattachés
      this.postComments.forEach(postComment => {
        let url = `http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/comments/${postComment.id}?force=true`;
        fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          method: 'DELETE'
        })
        .then(() => {
          // this.loadComments();   
        })
        .catch(error => {
          console.error(error);
        })        
      });
      // suppresion du post
      let url = `http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/posts/${this.postDetails.id}?force=true`;
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(() => {
        window.location.href = "/"
      })
      .catch(error => {
        console.error(error);
      })       
    }

  }
}
</script>

