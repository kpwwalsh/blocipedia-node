const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    return this._isBasic()|| this._isPremium()||this._isAdmin();
  }

  create() {
    return this.new();
  }

  edit() {
    return this.user!=null;
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this._isAdmin();
  }

private() {
    return this._isPremium() || this._isAdmin();
 }
 
 public() {
    return this.private();
 }
}