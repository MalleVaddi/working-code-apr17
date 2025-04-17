import { Routes } from '@angular/router';
import { LocationFormComponent } from './location-form/location-form.component';
import { ListUserComponent } from './list-user/list-user.component'; 
import { UserFormComponent } from './user-form/user-form.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PostComponent } from './post/post.component'; 
import { LoginComponent } from './login/login.component';



export const routes: Routes = [
    {
        path: '',  //default component to display
        component: LoginComponent
    }, {
        path: 'login',  //  Login route
        component: LoginComponent
      }, {
        path: 'posts', 
        component: PostComponent
    }, {
        path: 'interactive-maps',  //when maps are clicked, display this component
        component: LocationFormComponent
    }, {
        path: 'addUser',  //when students added 
        component: UserFormComponent
    },  {
        path: 'editUser/:_id', //when students edited 
        component: UserFormComponent 
    }, {
        path: 'listUser',  //when students listed
        component: ListUserComponent
    },  {
        path: '**',  //when path cannot be found, keep this at the bottom
        component: NotFoundComponent
    },

];
