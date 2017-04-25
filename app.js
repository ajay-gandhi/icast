
const { app, Menu, Tray } = require('electron');
const path   = require('path');
const caster = require('./cast');

let tray, menu;

app.dock.hide();
app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'icons/ready_iconTemplate.png'));

  // Create menu
  template = [
    { label: 'Not casting', enabled: false },
    { label: 'Stop casting', visible: false, id: 'stop', click: stop_casting },
    { type: 'separator' },
    { label: 'Refresh list', click: refresh_devices }
  ];

  // Add available devices
  available_devices = caster.list();
  if (available_devices.length > 0) {
    template = template.concat(available_devices.map(device => {
      return {
        label: device,
        id: device,
        type: 'checkbox',
        click: choose_device,
        isTemp: true
      }
    }));

  } else {
    template.push({
      label: 'No devices available',
      enabled: false,
      isTemp: true
    });
  }

  // Add refresh option
  template = template.concat([
    { type: 'separator' },
    { label: 'Quit', role: 'quit' }
  ]);

  menu = Menu.buildFromTemplate(template);

  tray.setToolTip('Cast audio');
  tray.setContextMenu(menu);
});

/**
 * Stop casting if quitting
 */
app.on('before-quit', () => { caster.stop() });

/******************************* Cast Functions *******************************/

let casting_device = false;

/**
 * Called when a device is clicked in the menu
 */
let choose_device = (item) => {
  if (casting_device) {
    if (item.id === casting_device) return;
    caster.stop();
  }
  caster.start(item.id);
  casting_device = item.id;

  // Check item and show stop option
  item.checked = true;
  menu.items[0].label = 'Casting';
  menu.items[1].visible = true;

  tray.setImage(path.join(__dirname, 'icons/casting_iconTemplate.png'));
  tray.setContextMenu(menu);
}

/**
 * Stops casting
 */
let stop_casting = () => {
  if (casting_device) {
    caster.stop();
  } else {
    return;
  }

  casting_device = false;

  // Uncheck all
  menu.items = menu.items.map(item => {
    if (item.isTemp) item.checked = false;
    return item;
  });

  // Hide stop option
  menu.items[0].label = 'Not casting';
  menu.items[1].visible = false;

  tray.setImage(path.join(__dirname, 'icons/ready_iconTemplate.png'));
  tray.setContextMenu(menu);
}

/**
 * Refreshes the list of devices
 */
let refresh_devices = () => {
  let num_del = 0;
  for (let i = 4; i < menu.items.length; i++) {
    if (menu.items[i].isTemp) num_del++;
  }
  menu.items.splice(4, num_del);

  // Add available devices
  available_devices = caster.list();
  if (available_devices.length > 0) {
    for (let i = available_devices.length - 1; i >= 0; i--) {
      let device = available_devices[i];
      menu.items.splice(4, 0, {
        label: device,
        id: device,
        type: 'checkbox',
        click: choose_device,
        isTemp: true
      });
    }

  } else {
    menu.items.splice(4, 0, {
      label: 'No devices available',
      enabled: false,
      isTemp: true
    });
  }

  tray.setContextMenu(menu);
}
