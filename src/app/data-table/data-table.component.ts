import { SelectionModel } from "@angular/cdk/collections";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { UsersService } from "../users.service";

export interface PeriodicElement {
  position: number;
  firstName: string;
  secondName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, firstName: "Anna", secondName: "Testowa" },
  { position: 2, firstName: "Jacek", secondName: "Testowy" },
  { position: 3, firstName: "Kasia", secondName: "Słowik" },
  { position: 4, firstName: "Maria", secondName: "Pawlacz" },
  { position: 5, firstName: "Michał", secondName: "Burza" },
  { position: 6, firstName: "Józef", secondName: "Spokojny" }
];

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.css"]
})
export class DataTableComponent {
  displayedColumns: string[] = [
    "select",
    "position",
    "firstName",
    "secondName"
  ];
  @ViewChild("firstName") firstName: ElementRef;
  @ViewChild("secondName") secondName: ElementRef;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  isVisible = false;
  value: number;

  constructor(private usersService: UsersService) {}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onClickForm(mode) {
    if (mode === "add") {
      this.value = 1;
    } else {
      this.value = 2;
    }
    this.isVisible = !this.isVisible;
  }

  addItem() {
    const fName = this.firstName.nativeElement.value;
    const sName = this.secondName.nativeElement.value;
    const index = this.dataSource.data.length + 1;
    this.dataSource.data.push({
      position: index,
      firstName: fName,
      secondName: sName
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(
      this.dataSource.data
    );
    console.log(this.dataSource.data);
  }

  updateItem() {
    if (this.selection.selected.length === 1) {
      this.selection.selected[0].firstName = this.firstName.nativeElement.value;
      this.selection.selected[0].secondName = this.secondName.nativeElement.value;
    } else if (this.selection.selected.length > 1) {
      alert("You can only select one user at once!");
    } else {
      alert("You didn't select anything!");
    }
  }

  deleteItem() {
    this.selection.selected.forEach(item => {
      const index: number = this.dataSource.data.findIndex(d => d === item);
      if (index > -1) {
        this.dataSource.data.splice(index, 1);
      }
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(
      this.dataSource.data
    );
  }

  onSave() {
    this.usersService
      .storeUsers(this.dataSource.data)
      .subscribe(
        response => console.log(response),
        error => console.log(error)
      );
  }

  onGet() {
    this.usersService
      .getUsers()
      .subscribe(
        (users: PeriodicElement[]) => (this.dataSource.data = users),
        error => console.log(error)
      );
  }
}
