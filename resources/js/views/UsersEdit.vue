<template>
    <div>
        <div v-if="message" class="alert">{{ message }}</div>
        <div v-if="! loaded">Loading...</div>
        <form v-else @submit.prevent="onSubmit($event)">
            <div class="form-group">
                <label for="user_name">Name</label>
                <input id="user_name" v-model="user.name" />
            </div>
            <div class="form-group">
                <label for="user_email">Email</label>
                <input id="user_email" type="email" v-model="user.email" />
            </div>
            <div class="form-group">
                <button type="submit" :disabled="saving">Update</button>
            </div>
        </form>
        <p>
            <button @click.prevent="goBack()">Back</button>
        </p>
    </div>
</template>
<script>
import Api from '../api/users';

    export default {
        data() {
            return {
                message: null,
                loaded: false,
                saving: false,
                user: {
                    id: null,
                    name: "",
                    email: ""
                }
            };
        },
        methods: {
            onSubmit(event) {
                // @todo form submit event
                this.saving = true;

                Api.update(this.user.id, {
                    name: this.user.name,
                    email: this.user.email,
                }).then(response => {
                    this.message = 'User updated';
                    setTimeout(() => {
                        this.$router.go(-1);
                        this.message = null;
                    }
                    , 2000);
                    this.user = response.data.data;
                }).catch(error => {
                    console.log(error);
                }).then(_ => this.saving = false);
            },
            goBack(){
                this.$router.go(-1);
            }
        },
        created() {
            // @todo load user details
            Api.find(this.$route.params.id)
                .then(response => {
                    this.loaded = true;
                    this.user = response.data.data;
                });
        }
    };
</script>
<style lang="scss">
$red: lighten(red, 30%);
$darkRed: darken($red, 50%);
.form-group label {
  display: block;
}
.alert {
    background: $red;
    color: $darkRed;
    padding: 1rem;
    margin-bottom: 1rem;
    width: 50%;
    border: 1px solid $darkRed;
    border-radius: 5px;
}
</style>
