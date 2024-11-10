import { LogicalPosition, LogicalSize, PhysicalPosition } from "@tauri-apps/api/dpi";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

let xEl: HTMLInputElement | null;
let yEl: HTMLInputElement | null;
let wEl: HTMLInputElement | null;
let hEl: HTMLInputElement | null;
let dxEl: HTMLElement | null;
let dyEl: HTMLElement | null;
let dwEl: HTMLElement | null;
let dhEl: HTMLElement | null;
let outerEl: HTMLInputElement | null;
let mixedEl: HTMLInputElement | null;
let mainWin = WebviewWindow.getCurrent();

const posTest1 = new PhysicalPosition(10, 25);
const posTest2 = posTest1.toLogical(1);
console.log('phyical -> logical', posTest1, posTest2);

async function updateDimensionFields(win: WebviewWindow) {
  const scaleFactor = await win.scaleFactor();
  const pPosition = await (outerEl?.checked || mixedEl?.checked ? win.outerPosition() : win.innerPosition());
  const pSize = await (outerEl?.checked ? win.outerSize() : win.innerSize());
  const lPosition = pPosition.toLogical(scaleFactor);
  const lSize = pSize.toLogical(scaleFactor);
  console.log('pPos', pPosition);
  console.log('lPos', lPosition);
  console.log('lSize', lSize);
  dxEl!.innerText = (lPosition.x - +xEl!.value).toString();
  dyEl!.innerText = (lPosition.y - +yEl!.value).toString();
  dwEl!.innerText = (lSize.width - +wEl!.value).toString();
  dhEl!.innerText = (lSize.height - +hEl!.value).toString();
  xEl!.value = lPosition.x.toString();
  yEl!.value = lPosition.y.toString();
  wEl!.value = lSize.width.toString();
  hEl!.value = lSize.height.toString();
}

function updateWindowDimensions() {
  mainWin.setPosition(getPositionFromInputs());
  mainWin.setSize(getSizeFromInputs());
}

function getPositionFromInputs(): LogicalPosition {
  const x = +(xEl?.value ?? 0);
  const y = +(yEl?.value ?? 0);
  return new LogicalPosition(x, y);
}

function getSizeFromInputs(): LogicalSize {
  const w = +(wEl?.value ?? 0);
  const h = +(hEl?.value ?? 0);
  return new LogicalSize(w, h);
}

async function createWindow(delayed: boolean) {
  await (await WebviewWindow.getByLabel('newWin'))?.close();
  const newWin = new WebviewWindow('newWin', {
    x: +(xEl?.value ?? 0),
    y: +(yEl?.value ?? 0),
    width: +(wEl?.value ?? 0),
    height: +(hEl?.value ?? 0),
  });
  newWin.once('tauri://created', async () => {
    const func = async () => {
      await updateDimensionFields(newWin);
      newWin.close();
    }
    if (delayed) {
      setTimeout(() => func() , 100);
    } else {
      func();
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  xEl = document.querySelector("#x");
  yEl = document.querySelector("#y");
  wEl = document.querySelector("#w");
  hEl = document.querySelector("#h");
  dxEl = document.querySelector("#dx");
  dyEl = document.querySelector("#dy");
  dwEl = document.querySelector("#dw");
  dhEl = document.querySelector("#dh");
  outerEl = document.querySelector("#outer");
  mixedEl = document.querySelector("#mixed");
  document.querySelector("#dimensions-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    updateWindowDimensions();
  });
  document.querySelector("#dimensions-get-button")?.addEventListener("click", (e) => {
    e.preventDefault();
    updateDimensionFields(mainWin);
  });
  document.querySelector("#create-window")?.addEventListener("click", (e) => {
    e.preventDefault();
    createWindow(false);
  });
  document.querySelector("#create-window-delayed")?.addEventListener("click", (e) => {
    e.preventDefault();
    createWindow(true);
  });
});
