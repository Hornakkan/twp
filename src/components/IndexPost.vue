<script setup>
  // import { title } from 'process';
  import ItemList from './ItemList.vue'
  import ItemPost from './ItemPost.vue'
  // import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
<!-- header pour la partie login/out du user -->
<div class="post--header">
  <div class="post--header--logo neontext">Tr'hello World</div>
  <div class="post--header--content" v-if="!hideLogForm">
    <input type="text" id="username" name="username" placeholder="username" v-model="username">
    <input type="password" id="password" name="password" placeholder="password" v-model="password">
    <button @click="login">Sign in</button>
  </div>
  <div class="post--header--content" v-if="hideLogForm">
    Welcome {{ usernicename }}
    <button @click="logout">Sign out</button>
  </div>
</div>

<!-- wrapper pour le corps de l'index page -->
<div class="post--wrapper">
  <!-- chargement des listes et de leur contenu -->
  <ItemList v-for="list in lists" :key="list.id" :listId="list.id">
    <template #list--title>
      {{ list.name }}
    </template>
    <template #list--content>
      <ItemPost v-for="post in loadFilteredPosts(list.id)" :postId="post.id">
        <template #post--content>
          {{ post.title.rendered }}
        </template>
      </ItemPost>
    </template>
    <template #list--add>
      <button v-if="userid" @click="addPost(list.id)">Add a card</button>
      <button v-if="userid" @click="deleteList(list.id)">Delete list</button>
    </template>
  </ItemList>

  <!-- création d'une nouvelle liste -->
  <div v-if="userid" class="new--list">
    <input v-if="toggleList" type="text" v-model="listName" placeholder="Your new list's name">
    <button v-if="toggleList" @click="addList">Submit</button>
    <button v-if="toggleList" @click="toggleAddList">Cancel</button>
    <button v-if="!toggleList" @click="toggleAddList">Add new list</button>
  </div>

</div>

</template>


<script>
import { nextTick } from 'vue'
export default {
  data() {
    return {
          hideLogForm: localStorage.getItem('jwt') ? true:false,
          toggleList: false,
          listName: '',
          listId: 0,
          username: '',
          usernicename: localStorage.getItem('usernice') ? localStorage.getItem('usernice'):'',
          userid: localStorage.getItem('userid') ? localStorage.getItem('userid'):'',
          password: '',
          postId: 0,
          posts: [],
          lists: [],
          comments: []
    }
  },
  mounted() {
    this.checkLogin();
    this.loadLists();
    this.loadPosts();
    this.loadComments();
  },
  updated() {
    this.dragEvent();
  },
  methods: {
// ----------------------
// drag & drop methods
// ----------------------    
    async dragEvent() {
      // attendre le prochain tick, càd une fois le DOM complètement constitué après le v-for
        await nextTick();
      // tri par drag and drop
      const draggables = document.querySelectorAll('.post')
      let wrapper = document.querySelectorAll('.list--details--content');
      let dragged = '';
      let dragPostId = '';
      let dropCatId = '';
      
      // event listener pour les éléments déclarés comme draggable
      draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (event) => {
          // récupérer l'élément qui est drag
          document.querySelector('body').setAttribute('style', 'backdrop-filter: grayscale(1) contrast(0.2);');
          dragPostId = event.target.firstChild.value;
          if (event.target.className == '' && event.target.tagName == 'A') {
            dragged = event.target.parentElement.parentElement.parentElement;
            dragPostId = event.target.parentElement.parentElement.parentElement.firstChild.value;
          } else if(event.target.className == 'post') {
            dragged = event.target;
            dragPostId = event.target.firstChild.value;
          }
        })
      })
      wrapper.forEach(droppable => {
        droppable.addEventListener('dragover', (event) => {
          event.preventDefault();
        })
        droppable.addEventListener('drop', (event) => {
          event.preventDefault();
          document.querySelector('body').setAttribute('style', 'backdrop-filter: none');
          let dropTarget = '';
          // déterminer l'objet sur lequel on drop en fonction de la div ou du h3 qui reçoit l'event
          if(event.target.className == 'list--details--content') {     
            // si c'est le conteneur ajouter comme enfant   
            event.target.appendChild(dragged);
            dropCatId = event.target.firstChild.value;
          } else if (event.target.className == 'post--details--content') {
            dropTarget = event.target.offsetParent.offsetParent;
            dropCatId = dropTarget.parentElement.firstChild.value;
            // insérer l'objet drag avant l'objet drop dans la liste des noeuds du DOM
            droppable.insertBefore(dragged, dropTarget);
          } else if (event.target.className == '' && event.target.tagName == 'A') {
            dropTarget = event.target.offsetParent.offsetParent.offsetParent;
            dropCatId = dropTarget.parentElement.firstChild.value;
            // insérer l'objet drag avant l'objet drop dans la liste des noeuds du DOM
            droppable.insertBefore(dragged, dropTarget);
          }

          if(dropCatId != null) {
            let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/posts/' + dragPostId;
            fetch(url, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('jwt')}`
              },              
              method: 'POST',
              body: JSON.stringify({
                categories: [dropCatId]
              })
            })
            .then( () => {
              // this.loadLists();
              // this.loadPosts(false);
            })
            .catch(error => {
              console.error(error);
            })
          }
        })
      })
    },
// ----------------------
// buttons methods
// ----------------------
    toggleAddList() {
      if (localStorage.getItem('jwt')) {
        this.toggleList = !this.toggleList;
      }
    },
// ----------------------
// authentication methods
// ----------------------
    checkLogin() {
      if(localStorage.getItem('jwt')) {
        this.hideLogForm = true;
      } else {
        this.hideLogForm = false;
      }
    },
    logout() {
      localStorage.removeItem('userid');
      localStorage.removeItem('usernice');
      localStorage.removeItem('jwt');
      this.toggleList = false;
      this.userid = '';
      this.usernicename = '';
      this.checkLogin();
      },
    login() {
      // création du token via JWT pour le user qui se tente de se connecter
      let token = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/jwt-auth/v1/token';
      fetch(token, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      })
      .then(response => {
        return response.json();
      })
      .then(user => {
        // authentification réussie
        if(user.token) {
          this.hideLogForm = true;
          this.username = '';
          this.password = '';
          // this.usernicename = user.user_nicename;
          //localStorage.setItem('usernice', user.user_nicename);
          this.usernicename = user.user_display_name;
          localStorage.setItem('usernice', user.user_display_name);
          localStorage.setItem('jwt', user.token);
          // je récupère ensuite le user id sur l'endpoint du user actuellement connecté avec succès
          let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/users/me';
          fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            method: 'GET'
          })
          .then(response => {
            return response.json();
          })
          .then(user => {
            this.userid = user.id;
            localStorage.setItem('userid', user.id);
          })
          .catch(error => {
            console.error(error);
          })
        }
      })
      .catch (error => {
        console.error(error);
      })
    },
// ----------------------
// loading methods
// ----------------------    
    loadLists() {
    let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/categories';

    fetch(url, {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.lists = data;
        for(let i=0; i < this.lists.length; i++) {
          if (this.lists[i].id == 1) {
            this.lists.splice(i,1);
          }
        }
        // tri des listes par leur id
        this.lists.sort(function(a, b){return a.id - b.id});
      })
      .catch(error => {
        console.error(error);
      })
    },
    loadPosts(loadEvents = true) {
    let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/posts';

    fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.posts = data;
        if(loadEvents) {
          this.dragEvent();
        }
      })
      .catch(error => {
        console.error(error);
      })
    },
    loadFilteredPosts(listId) {
      return this.posts.filter( post => { return post.categories[0] == listId})
    },
    loadComments() {
    let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/comments';

    fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.comments = data;
      })
      .catch(error => {
        console.error(error);
      })
    },
// ----------------------
// adding methods
// ----------------------    
    addList() {
      if(localStorage.getItem('jwt') && this.listName != '') {
        // insérer la donnée
          let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/categories';
          fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            method: 'POST',
            body: JSON.stringify({
              name: this.listName,
              slug: this.listName.toLocaleLowerCase()
            })
          })
          .then(() => {
            this.loadLists();
            // reset des champs de saisie.
            this.listName = '';
            this.toggleAddList();
          })
          .catch(error => {
            console.error(error);
          })
      }
    },
    addPost(listId) {
      // console.log("Categorie: ", listId);
      // console.log("Author: ", localStorage.getItem('userid'));
      let url = 'http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/posts/';
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        method: 'POST',
        body: JSON.stringify({
          title: 'New Card',
          content: 'New card content',
          excerpt: 'New card content',
          slug: 'new-card',
          status: 'publish',
          author: parseInt(localStorage.getItem('userid')),
          categories: [listId]
        })
      })
      .then(response => {
        // console.log(response);
        // this.loadLists();
        this.loadPosts();
      })
      .catch(error => {
        console.error(error);
      })
    },
// ----------------------
// deleting methods
// ----------------------    
    deleteList(listId) {
      // /!\ delete tous les posts qui ont la catégorie listId avant de supprimer la "liste"
        let containsPosts = event.target.parentNode.previousElementSibling.lastChild.childElementCount;
        if(containsPosts > 0) {
          //console.log("contains posts");
          let filteredPosts = this.posts.filter( post => { return post.categories[0] == listId});
          let postsIds = [];
          // suppressions des posts liés à la catégorie
          filteredPosts.forEach(element => {
            postsIds.push(element.id);
            let url = `http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/posts/${element.id}?force=true`;
            fetch(url, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
              },
              method: 'DELETE'
            })
            .then(() => {
              // this.loadPosts();
            })
            .catch(error => {
              console.error(error);
            })            
          });
          // suppression des commentaires liés à ces posts
          // console.log(this.comments);
          // console.log(postsIds);
          this.comments.forEach(myComment => {
            if(postsIds.includes(myComment.post)) {
              // console.log("A supprimer: ", myComment.id);
              let url = `http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/comments/${myComment.id}?force=true`;
              fetch(url, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                method: 'DELETE'
              })
              .then(() => {
                // this.loadPosts();
              })
              .catch(error => {
                console.error(error);
              })                
            }
          })
          // rechargement des posts restants
          this.loadPosts();          
        }     
      // /!\ il faut ajouter le param "?force=true" à la requête pour pouvoir delete des "catégories"
      let url = `http://localhost/Coding%20Academy%202022/Rendu/my-wp/index.php/wp-json/wp/v2/categories/${listId}?force=true`;
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        method: 'DELETE'
      })
      .then(() => {
        this.loadLists();
      })
      .catch(error => {
        console.error(error);
      })
    }
// ----------------------
// updating methods
// ---------------------- 

  }
}
</script>
