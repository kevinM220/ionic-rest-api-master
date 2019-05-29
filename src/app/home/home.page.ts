import { Component, OnInit } from '@angular/core';

import { AlertController, ToastController, LoadingController } from '@ionic/angular';

import { TasksService } from './../services/tasks.service';
import { Task } from './../interfaces/task';
import {NotificationService} from '../services/Notification.server';
import {BehaviorSubject} from 'rxjs';
import {LIFECYCLE_HOOKS_VALUES} from '@angular/compiler/src/lifecycle_reflector';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
 public mySubject: BehaviorSubject<any>;
 tasks: Task[] = [];



  constructor(
    private tasksService: TasksService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private notificationService: NotificationService
  ) {this.mySubject = new BehaviorSubject ( null); }


  private handleMessageReceived(message: any): void {
    console.log('Mensaje recibido:' + JSON.stringify(message));
      this.tasksService.getAllTasks()
          .subscribe(async (tasks) => {
              console.log(tasks);
              this.tasks = tasks;
           });
      }

  /* ------------------------------------------------------------------------------------------------- */
  public doNotificationSubscription(): void {
    try {
      this.notificationService.getTaskNotification().subscribe((result) => {
        this.handleMessageReceived(result);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando..',
    });
    await loading.present();

    this.doNotificationSubscription();
    this.tasksService.getAllTasks()
        .subscribe(async (tasks) => {
      console.log(tasks);
      this.tasks = tasks;
      await loading.dismiss();
    });
  }

  async openAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Dato!',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'aqui la tarea'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Crear',
          handler: (data) => {
            this.createTask(data.title);
          }
        }
      ]
    });
    await alert.present();
  }

  createTask(title: string) {
    const task = {
      userId: '1',
      title,
      completed: true
    };
    this.tasksService.createTask(task)
    .subscribe((newTask) => {
      this.tasks.unshift(newTask);
    });
  }



  deleteTask(id: string, index: number) {

    this.tasksService.deleteTask(id)

    .subscribe(() => {
      this.tasks.splice(index, 1);
      this.presentToast('Su tarea fue eliminada correctamente');
    });

  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    await toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargand',
      duration: 20000
    });

    await loading.present();
    return loading;
  }


}
