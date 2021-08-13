import { App, Notice, Plugin, PluginManifest } from 'obsidian';
import { SettingsTab } from './settings/SettingsTab';
import { JiraSettings } from './interfaces';

const DEFAULT_SETTINGS: JiraSettings = {
  showInRibbon: true,
  apiUsername: '',
  apiSecret: '',
  apiUrl: '',
  fileLocation: '',
  template: '',
};

/**
 * Create notes based on Jira tasks
 */
export class JiraPlugin extends Plugin {
  public settings!: JiraSettings;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async loadSettings() {
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(await this.loadData()),
    };
  }

  async onload() {
    await this.loadSettings();

    if (this.settings.showInRibbon) {
      this.addRibbonIcon('dice', 'Sample Plugin', () => {
        new Notice('This is a notice!');
      });
    }

    this.addSettingTab(new SettingsTab(this.app, this));
  }
}

export default JiraPlugin;
