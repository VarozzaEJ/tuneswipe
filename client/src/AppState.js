import { action, makeAutoObservable } from "mobx"
import { isValidProp } from "./utils/isValidProp.js"


class ObservableAppState {

  user = null
  /** @type {import('./models/Account.js').Account} */
  account = null

  /** @type {import('./models/MusicPost.js').MusicPost[]} */
  musicPosts = []

  /** @type {import('./models/Comment.js').Comment[]} user info from the database*/
  comments = []

  /** @type {import('./models/PostReport.js').PostReport[]} user info from the database*/
  postReports = []

  constructor() {
    makeAutoObservable(this)
  }

}

// eslint-disable-next-line no-undef
export const AppState = new Proxy(new ObservableAppState(), {
  get(target, prop) {
    isValidProp(target, prop)
    return target[prop]
  },
  set(target, prop, value) {
    isValidProp(target, prop)
    action(() => {
      target[prop] = value
    })()
    return true
  }
})