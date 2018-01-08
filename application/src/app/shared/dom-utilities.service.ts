import { Injectable } from '@angular/core';

@Injectable()
export class DomUtilitiesService {
  loadingBackgroundDiv: any;

  constructor() { }

  addFullPageLoading(){
    this.loadingBackgroundDiv = document.createElement('div');
      this.loadingBackgroundDiv.id = "loading-element";
      this.loadingBackgroundDiv.style.position = "fixed";
      this.loadingBackgroundDiv.style.top = "0";
      this.loadingBackgroundDiv.style.left = "0";
      this.loadingBackgroundDiv.style.height = "100%";
      this.loadingBackgroundDiv.style.overflow = "visible";
      this.loadingBackgroundDiv.style.width = "100%";
      this.loadingBackgroundDiv.style["z-index"] = "10000";
      this.loadingBackgroundDiv.style["background-repeat"] = "no-repeat";
      this.loadingBackgroundDiv.style["background-position"] = "center center";
      this.loadingBackgroundDiv.style["background-size"] = "cover";
      // this.loadingBackgroundDiv.style["background-image"] = "url(/assets/images/home-masthead.jpg)";
      
      let image = document.createElement('img');
      image.src = "/assets/images/loading.svg";
      image.id = "loading-element-img";
      image.style.position = "fixed";
      image.style.top = "50%";
      image.style.left = "50%";
      image.style.height = "auto";
      image.style.width = "160px";
      this.loadingBackgroundDiv.style["z-index"] = "10001";
      image.style["margin-top"] = "-80px";
      image.style["margin-left"] = "-80px";

      this.loadingBackgroundDiv.appendChild(image);

      document.getElementsByTagName('body')[0].appendChild(this.loadingBackgroundDiv);
  }

  removeFullPageLoading() {

    if (!this.loadingBackgroundDiv){
      this.loadingBackgroundDiv = document.getElementById("loading-element");
    }
    
    if (this.loadingBackgroundDiv){
      document.getElementsByTagName('body')[0].removeChild(this.loadingBackgroundDiv);
      this.loadingBackgroundDiv = null;
    }
  }
}
