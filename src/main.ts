import { PhysicalPosition, PhysicalSize } from "@tauri-apps/api/dpi";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

let xEl: HTMLInputElement | null;
let yEl: HTMLInputElement | null;
let wEl: HTMLInputElement | null;
let hEl: HTMLInputElement | null;
let outerEl: HTMLInputElement | null;
let win = WebviewWindow.getCurrent();

async function updateDimensionFields() {
  const position = await (outerEl?.checked ? win.outerPosition() : win.innerPosition());
  const size = await (outerEl?.checked ? win.outerSize() : win.innerSize());
  xEl!.value = position.x.toString();
  yEl!.value = position.y.toString();
  wEl!.value = size.width.toString();
  hEl!.value = size.height.toString();
}

function updateWindowDimensions() {
  win.setPosition(getPositionFromInputs());
  win.setSize(getSizeFromInputs());
}

function getPositionFromInputs(): PhysicalPosition {
  const x = +(xEl?.value ?? 0);
  const y = +(yEl?.value ?? 0);
  return new PhysicalPosition(x, y);
}

function getSizeFromInputs(): PhysicalSize {
  const w = +(wEl?.value ?? 0);
  const h = +(hEl?.value ?? 0);
  return new PhysicalSize(w, h);
}

window.addEventListener("DOMContentLoaded", () => {
  xEl = document.querySelector("#x");
  yEl = document.querySelector("#y");
  wEl = document.querySelector("#w");
  hEl = document.querySelector("#h");
  outerEl = document.querySelector("#outer");
  document.querySelector("#dimensions-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    updateWindowDimensions();
  });
  document.querySelector("#dimensions-get-button")?.addEventListener("click", (e) => {
    e.preventDefault();
    updateDimensionFields();
  });
});
