export const useModalStore = defineStore('modal', {
    state: () => ({
        createInvite: false,
        confirmInvite: false,
        editProfile: false,
        certificateModal: false,
        changePassword: false,
    }),
    actions: {
        openModal(name, union = null) {
            this.closeModals();
            this[name] = true;
        },
        closeModals() {
            for (let name in this.$state) {
                this[name] = false;
            }
        },
    },
});
