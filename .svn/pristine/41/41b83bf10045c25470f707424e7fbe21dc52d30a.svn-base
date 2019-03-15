Component({
  /** * 组件的属性列表，使用组件时，传入的参数 */
  properties: {
    name: {
      type: String,
      value: 'name'
    },
    callbackUrl: {
      type: String,
      value: 'callbackUrl'
    }
  },
  /** * 组件的初始数据，组件内部的数据 */
  data: {
    type: "组件",
    tabbarData: [{
        name: '生理',
        src: '/page/components/images/tabbar/tabbar-icon-1.jpg',
        url: '/page/pages/physiology/physiology'
      },
      {
        name: '运动',
        src: '/page/components/images/tabbar/tabbar-icon-2.jpg',
        url: '/page/pages/exercise/exercise'
      },
      {
        name: '心理',
        src: '/page/components/images/tabbar/tabbar-icon-3.jpg',
        url: '/page/pages/mentality/mentality'
      },
      {
        name: '',
        src: '/page/components/images/tabbar/tabbar-icon-index.jpg',
        url: '/page/pages/index/index'
      },
      {
        name: '营养',
        src: '/page/components/images/tabbar/tabbar-icon-4.jpg',
        url: '/page/pages/pabulum/pabulum'
      },
      {
        name: '生态',
        src: '/page/components/images/tabbar/tabbar-icon-5.jpg',
        url: '/page/pages/zoology/zoology'
      },
      {
        name: '文化',
        src: '/page/components/images/tabbar/tabbar-icon-6.jpg',
        url: '/page/pages/culture/culture'
      }
    ]
  },
  /** * 组件的方法列表，组件内部的方法 */
  methods: {
    rollback(e) {
      let url = this.data.callbackUrl;
      if (url) {
        wx.navigateTo({
          url:"/pages/index/index"
        });
      }
    }
  }
})