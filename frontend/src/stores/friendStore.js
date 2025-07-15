import { defineStore } from 'pinia'

export const useFriendStore = defineStore('friend', {
  state: () => ({
    profiles: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ],
    invitations: [
      { id: 101, userId: 3, status: 'received' }
    ]
  }),
  getters: {
    friends: state => state.profiles,
    pendingInvites: state => state.invitations.filter(i => i.status === 'received')
  },
  actions: {
    sendInvite(userId) {
      if (!this.invitations.some(i => i.userId === userId && i.status === 'sent')) {
        this.invitations.push({ id: Date.now(), userId, status: 'sent' })
      }
    },
    acceptInvite(inviteId) {
      const invite = this.invitations.find(i => i.id === inviteId)
      if (invite) invite.status = 'accepted'
    }
  }
})
