import { Auth0Provider } from '@bcwdev/auth0provider'
import { accountService } from '../services/AccountService'
import BaseController from '../utils/BaseController'

export class AccountController extends BaseController {
  constructor() {
    super('account')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getUserAccount)
      .put('', this.editUserAccount)
      .post('/request', this.requestFeature)
      .post('/report', this.reportBug)
  }

  async getUserAccount(req, res, next) {
    try {
      const account = await accountService.getAccount(req.userInfo)
      res.send(account)
    } catch (error) {
      next(error)
    }
  }

  async editUserAccount(req, res, next) {
    try {
      const accountId = req.userInfo.id
      req.body.id = accountId
      const account = await accountService.updateAccount(req.userInfo, req.body)
      res.send(account)
    } catch (error) {
      next(error)
    }



  }
  async requestFeature(req, res, next) {
    try {
      const featureData = req.body
      const feature = await accountService.requestFeature(featureData)
      res.send(feature)
    } catch (error) {
      next(error)
    }
  }

  async reportBug(req, res, next) {
    try {
      const bugData = req.body
      const userId = req.userInfo.id
      bugData.creatorId = userId
      const bug = await accountService.reportBug(bugData)
      res.send(bug)
    } catch (error) {
      next(error)
    }
  }
}
