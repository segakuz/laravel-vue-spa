<template>
    <div>
        <div v-if="error" class="error alert">
            {{ error }}
        </div>
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
                <button :disabled="saving" @click.prevent="onDelete($event)">Delete</button>
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
                },
                error: null
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
                    this.error = null;
                    this.message = 'User updated';
                    setTimeout(() => {
                        this.$router.go(-1);
                        this.message = null;
                    }
                    , 2000);
                    this.user = response.data.data;
                }).catch(error => {
                    // console.log(error);
                    this.error = error.response.data.message || error.message;
                }).then(_ => this.saving = false);
            },
            onDelete(){
                this.saving = true;
                Api.delete(this.user.id)
                    .then(response => {
                        console.log(response);
                        this.message = 'User deleted';
                        setTimeout(() => {
                            this.$router.go(-1);
                            // this.$router.push({ name: 'users.index' });
                            this.message = null;
                        }
                        , 2000);
                    });
            },
            goBack(){
                // this.$router.go(-1);
                this.$router.push({ name: 'users.index' });
            }
        },
        created() {
            // @todo load user details
            Api.find(this.$route.params.id)
                .then(response => {
                    this.loaded = true;
                    this.user = response.data.data;
                })
                .catch(err => {
                    this.$router.push({name: '404'});
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
