import { PluginSettingTab, App, Setting } from 'obsidian';
import { JiraPlugin } from '../JiraPlugin';
import { KeysMatching } from '../utils';
import { JiraSettings } from '../interfaces';

export interface SettingOptions<T> {
  setting: KeysMatching<JiraSettings, T>;
  title: string;
  description?: string;
}

export interface TextSettingOptions extends SettingOptions<string> {
  type?: 'text' | 'password';
}

export interface ToggleSettingsOptions extends SettingOptions<boolean> {}

export class SettingsTab extends PluginSettingTab {
  constructor(app: App, private plugin: JiraPlugin) {
    super(app, plugin);
  }

  protected addToggleSetting({ setting: settingName, title, description }: ToggleSettingsOptions) {
    const value = this.plugin.settings[settingName] ?? false;
    const setting = new Setting(this.containerEl).setName(title);
    if (description) {
      setting.setDesc(description);
    }
    setting.addToggle((toggle) => {
      toggle.setValue(value).onChange(async (value) => {
        this.plugin.settings[settingName] = value;
        await this.plugin.saveSettings();
      });
    });
  }

  protected addTextSetting({ setting: settingName, title, description, type = 'text' }: TextSettingOptions) {
    const value = this.plugin.settings[settingName] ?? '';
    const setting = new Setting(this.containerEl).setName(title);
    if (description) {
      setting.setDesc(description);
    }
    setting.addText((input) => {
      input.setValue(value).onChange(async (value) => {
        this.plugin.settings[settingName] = value;
        await this.plugin.saveSettings();
      });
    });
    (setting.controlEl.querySelector('input') as HTMLInputElement).type = type;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Obsidian Jira Settings' });

    this.addToggleSetting({ setting: 'showInRibbon', title: 'Show Ribbon Button?', description: 'Requires restart.' });

    this.addTextSetting({ setting: 'apiUrl', title: 'Jira API URL' });
    this.addTextSetting({ setting: 'apiUsername', title: 'Jira API Username' });
    this.addTextSetting({ setting: 'apiSecret', title: 'Jira API Secret', type: 'password' });
  }
}
