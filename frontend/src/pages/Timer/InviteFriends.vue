<template>
  <q-page data-cy="page_invite_friends" class="full-height">
    <q-btn icon="close" size="lg" flat round class="absolute-top-right" @click="goBack()" />
    <div class="column items-center" style="height: 100vh; width: 100vw">
      <div class="col q-mb-md">
        <q-list bordered>
          <q-item-label header>Friends</q-item-label>
          <q-item v-for="friend in friends" :key="friend.id" class="justify-between">
            <q-item-section>{{ friend.name }}</q-item-section>
            <q-item-section side>
              <q-btn v-if="!isInvited(friend.id)" label="Invite" size="sm" color="primary" @click="sendInvite(friend.id)" />
              <span v-else>Invited</span>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col">
        <q-list bordered v-if="pendingInvites.length">
          <q-item-label header>Pending Invites</q-item-label>
          <q-item v-for="invite in pendingInvites" :key="invite.id" class="justify-between">
            <q-item-section>{{ getUserName(invite.userId) }}</q-item-section>
            <q-item-section side>
              <q-btn label="Accept" size="sm" color="primary" @click="acceptInvite(invite.id)" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useFriendStore } from 'stores/friendStore'

export default {
  name: 'InviteFriends',
  setup () {
    const friendStore = useFriendStore()
    return { friendStore }
  },
  computed: {
    friends () {
      return this.friendStore.friends
    },
    pendingInvites () {
      return this.friendStore.pendingInvites
    }
  },
  methods: {
    sendInvite (id) {
      this.friendStore.sendInvite(id)
    },
    acceptInvite (id) {
      this.friendStore.acceptInvite(id)
    },
    isInvited (id) {
      return this.friendStore.invitations.some(i => i.userId === id && i.status === 'sent')
    },
    getUserName (id) {
      const user = this.friendStore.friends.find(u => u.id === id)
      return user ? user.name : 'User'
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
