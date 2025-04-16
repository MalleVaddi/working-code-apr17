import { Routes } from '@angular/router';
import { LocationFormComponent } from './location-form/location-form.component';
import { ListUserComponent } from './list-user/list-user.component'; 
import { UserFormComponent } from './user-form/user-form.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CommentComponent } from './comment/comment.component';



export const routes: Routes = [
    {
        path: '',  //default component to display
        component: ListUserComponent
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
        path: 'comment',  //when path cannot be found, keep this at the bottom
        component: CommentComponent
    }, {
        path: '**',  //when path cannot be found, keep this at the bottom
        component: NotFoundComponent
    },

];
