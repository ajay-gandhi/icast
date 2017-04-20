
const { app, Menu, Tray } = require('electron');
const caster = require('./cast');

let tray,
    template;

app.on('ready', () => {
  tray = new Tray('./icons/ready_iconTemplate.png');

  // Create menu
  template = [
    { label: 'Not casting', enabled: false },
    { type: 'separator' }
  ];

  // Add available devices
  available_devices = caster.list();
  if (available_devices.length > 0) {
    template.concat(available_devices.map(device => {
      return {
        label: device,
        id: device,
        type: 'radio',
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
    { label: 'Refresh list', click: refresh_devices }
  ]);

  tray.setToolTip('Cast audio');
  tray.setContextMenu(Menu.buildFromTemplate(template));
});

/**
 * Called when a device is clicked in the menu
 */
let choose_device = (item) => {
  caster.start(item.id);
}

/**
 * Refreshes the list of devices
 */
let refresh_devices = () => {
  template = template.filter(item => item.isTemp);

  // Add available devices
  available_devices = caster.list();
  if (available_devices.length > 0) {
    for (let i = available_devices.length - 1; i >= 0; i--) {
      let device = available_devices[i];
      template.splice(2, 0, {
        label: device,
        id: device,
        type: 'radio',
        click: choose_device,
        isTemp: true
      });
    }

  } else {
    template.splice(2, 0, {
      label: 'No devices available',
      enabled: false,
      isTemp: true
    });
  }

  tray.setContextMenu(Menu.buildFromTemplate(template));
}
