import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

export interface PeriodicElement {
  position: number;
  firstName: string;
  secondName: string;
}

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient) {}

  storeUsers(users: any[]) {
    return this.http.put(
      "https://angular-material-user-database.firebaseio.com/users.json",
      users
    );
  }

  getUsers() {
    return this.http.get<PeriodicElement[]>(
      "https://angular-material-user-database.firebaseio.com/users.json"
    );
  }
}
