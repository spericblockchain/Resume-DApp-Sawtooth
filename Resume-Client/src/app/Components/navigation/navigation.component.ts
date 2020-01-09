import { OnInit } from '@angular/core'
import { Component, Input } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { Router } from '@angular/router'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit {
  @Input()
  ContentType: number

  constructor (
    private breakpointObserver: BreakpointObserver,
    private route: Router
  ) { }

  ngOnInit() {
  }
  
  logOut() {
    sessionStorage.clear()
    this.route.navigateByUrl( '/' )
  }
}
