var appId = 'd6d78c3b896ec7c3f7538ea857d363f3474b7f13caba938c19b1c611d175fdd6';

Vue.component('fullscreen', {
	props: ['photo'],
	template: '#fullscreen',
	methods: {
		close: function() {
			this.$emit('close');
		}
	},
	beforeUpdate: function() {
		console.log("Loading image...")
	}
});

Vue.component('pagination', {
	template: '#pagination',
	props: {
		current: {
			type: Number,
			default: 1
		},
		total: {
			type: Number,
			default: 0
		},
		perPage: {
			type: Number,
			default: 9
		}
	},
	computed: {
		totalPages: function() {
			return Math.ceil(this.total/this.perPage)	
		},
		nextPage: function() {
			return this.current + 1
		},
		prevPage: function() {
			return this.current - 1
		}
	},
	methods: {
		changePage: function(page) {
			this.$emit('page-changed', page)
		}
	}
});

new Vue({
	el: '#app',
	data: {
		activeFullscreen: false,
		fullPhotoLink: '',
		photos: [],
		totalPhotos: 0,
		perPage: 9,
		currentPage: 1
	},
	methods: {
		fetchPhotos: function(page) {
			var options = {
				params: {
					client_id: appId,
					page: page,
					per_page: this.perPage
				}		
			}
			axios.get('https://api.unsplash.com/photos', options)
				.then(response => {
					console.log(response)
					this.photos = response.data
				})
				.catch(error => {
				    console.log(error)
				 })
		},
		openFullscreen: function(url) {
			this.activeFullscreen = true;
			this.fullPhotoLink = url;
			document.body.style.overflow = 'hidden';
		},
		closeFullscreen: function() {
			this.activeFullscreen = false;
			document.body.style.overflow = 'auto';
		}
	},
	beforeCreate: function() {
		console.log("Loading...")
	},
	created: function() {
		this.fetchPhotos(this.currentPage)
	}
})