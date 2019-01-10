var appId = 'd6d78c3b896ec7c3f7538ea857d363f3474b7f13caba938c19b1c611d175fdd6';

Vue.component('fullscreen', {
	data: function() {
		return {
			showPreloader: true
		}
	},
	props: ['photo'],
	template: '#fullscreen',
	methods: {
		close: function() {
			this.$emit('close');
		},
		photoLoading: function() {
			var img = new Image() ;
		    img.src = this.photo;
		    img.className = "fullscreen__photo"
		    img.onload = () => {
		    	var elem = document.getElementById('fullscreen__inner');
		     	elem.appendChild(img);
		     	elem.classList.add('fullscreen__inner_loaded');
		     	this.showPreloader = false;
		    };

		}
	},
	created: function() {
		this.photoLoading();
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
			this.$emit('page-changed', page);
		},
		hasPrev: function() {
	      return this.current > 1
	    },
	    hasNext: function() {
	      return this.current < this.totalPages
	    }
	}
});

var app = new Vue({
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
					this.totalPhotos = parseInt(response.headers["x-total"])
					this.currentPage = page
				})
				.catch(error => {
				    console.log(error)
				 })
		},
		openFullscreen: function(url) {
			this.activeFullscreen = true;
			this.fullPhotoLink = url;
		},
		closeFullscreen: function() {
			this.activeFullscreen = false;
		}
	},
	created: function() {
		this.fetchPhotos(this.currentPage)
	}
})

document.addEventListener('keyup', function(e) {
  if (e.keyCode === 27 && app.activeFullscreen) {
    app.activeFullscreen = false;
    document.body.style.overflow = 'auto';
  }
});