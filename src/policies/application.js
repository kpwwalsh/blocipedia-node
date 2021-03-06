module.exports = class ApplicationPolicy {

     constructor(user, record) {
       this.user = user;
       this.record = record;
     }
   
     _isOwner() {
       return this.record && (this.record.userId == this.user.id);
     }

     _isBasic() {
        return this.user && this.user.role == "basic";
      }

      _isPremium() {
        return this.user && this.user.role == "premium";
      }
   
     _isAdmin() {
       return this.user && this.user.role == "admin";
     }
   
     new() {
       return this.user != null;
     }
   
     create() {
       return this.new();
     }
   
     show() {
       return true;
     }

     edit() {
       return this.new();
     }
   
     update() {
       return this.edit();
     }
   
     destroy() {
       return this.new()&&this.record &&(this._isOwner()||this._isAdmin());
     }
   }