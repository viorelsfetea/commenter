"use strict";
import HnObserver from "./observers/HnObserver";
import RedditObserver from "./observers/RedditObserver";

import App from './App';

const app = new App();
app.init([HnObserver, RedditObserver]);
