<template>
    <section class="container">
        <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo"/>
        <h1 class="title">
            User
        </h1>
        <h2 class="info">
            {{ user.name }}
        </h2>
        <nuxt-link class="button" to="/">
            Users
        </nuxt-link>
    </section>
</template>

<script>
  export default {
    name: 'id',
    asyncData ({params, error}) {
      return {user: 'who'}
    },
    head () {
      return {
        title: `User: ${this.user.name}`
      }
    }
  }
</script>

<style scoped>
    .title {
        margin-top: 30px;
    }

    .info {
        font-weight: 300;
        color: #9aabb1;
        margin: 0;
        margin-top: 10px;
    }

    .button {
        margin-top: 30px;
    }
</style>
