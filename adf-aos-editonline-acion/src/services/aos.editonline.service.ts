import { Injectable } from '@angular/core';
import {
  AlfrescoApiService,
  AuthenticationService,
  NotificationService,
  AppConfigService,
  ContentService,
  TranslationService
} from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Injectable()
export class AosEditOnlineService {

  static ECM_HOST_CONFIG_KEY = 'ecmHost';
  static AOS_EDITONLINE_ACTION_HANDLER_KEY: string = 'aos-editonline';
  static MS_PROTOCOL_NAMES: any = {
    'doc': 'ms-word',
    'docx': 'ms-word',
    'docm': 'ms-word',
    'dot': 'ms-word',
    'dotx': 'ms-word',
    'dotm': 'ms-word',
    'xls': 'ms-excel',
    'xlsx': 'ms-excel',
    'xlsb': 'ms-excel',
    'xlsm': 'ms-excel',
    'xlt': 'ms-excel',
    'xltx': 'ms-excel',
    'xltm': 'ms-excel',
    'ppt': 'ms-powerpoint',
    'pptx': 'ms-powerpoint',
    'pot': 'ms-powerpoint',
    'potx': 'ms-powerpoint',
    'potm': 'ms-powerpoint',
    'pptm': 'ms-powerpoint',
    'pps': 'ms-powerpoint',
    'ppsx': 'ms-powerpoint',
    'ppam': 'ms-powerpoint',
    'ppsm': 'ms-powerpoint',
    'sldx': 'ms-powerpoint',
    'sldm': 'ms-powerpoint'
  };	

  constructor(
    private alfrescoApiService: AlfrescoApiService,
    private alfrescoAuthenticationService: AuthenticationService,
    private appConfigService: AppConfigService,
    private notificationService: NotificationService,
    private translationService: TranslationService
  ) {    
  }

  onActionEditOnlineAos(node: MinimalNodeEntryEntity): void {    
    if (node.isFile) {
      if (node.isLocked) {
        let checkedOut = node.aspectNames.find((aspect: string) => aspect === 'cm:checkedOut');
        let lockOwner = node.properties['cm:lockOwner'];
        let differentLockOwner = lockOwner.id !== this.alfrescoAuthenticationService.getEcmUsername();

        if (checkedOut && differentLockOwner) {
          this.onAlreadyLockedNotification(node.id, lockOwner);
        } else {
          this.triggerEditOnlineAos(node);
        }
      } else {
        this.triggerEditOnlineAos(node);
      }
    }        
  }

  private getUserAgent(): string {
    return navigator.userAgent.toLowerCase();
  }

  private isWindows(): boolean {
    return this.getUserAgent().indexOf('win') !== -1 ? true : false;
  }

  private isMacOs(): boolean {
    return this.getUserAgent().indexOf('mac') !== -1 ? true : false;
  }

  private onAlreadyLockedNotification(nodeId: string, lockOwner: string) {
      this.notificationService.openSnackMessage(`Document {nodeId} locked by {lockOwner}`, 3000);
  }

  private getProtocolForFileExtension(fileExtension: string) {
      return AosEditOnlineService.MS_PROTOCOL_NAMES[fileExtension];
  }

  private triggerEditOnlineAos(node: any): void {

    let url = this.onlineEditUrlAos(node);
    let fileExtension = node.name.split('.').pop() !== null ? node.name.split('.').pop().toLowerCase() : '';
    let protocolHandler = this.getProtocolForFileExtension(fileExtension);

    if (protocolHandler === undefined) {
        let message: any = this.translationService.get('AOS.ERROR.NO_PROTOCOL_HANDLER');
        this.notificationService.openSnackMessage(message.value, 3000);
        return;
    }

    if (!this.isWindows() && !this.isMacOs()) {
        let message: any = this.translationService.get('AOS.ERROR.UNSUPPORTED_CLIENT_OS');
        this.notificationService.openSnackMessage(message.value, 3000);
    } else {
        this.aos_tryToLaunchOfficeByMsProtocolHandler(protocolHandler, url);
    }
  }

  private onlineEditUrlAos(node: any): string {

    let pathElements = node.path.elements.slice(1, node.path.elements.length);
    let path = '/';
    for (let element of pathElements) {
      path = path + element.name + '/';
    }

    let ecmHost = this.appConfigService.get<string>(AosEditOnlineService.ECM_HOST_CONFIG_KEY);
    let url = ecmHost + '/alfresco/aos' + path + '/' + node.name;
    if (encodeURI(url).length > 256) {
      url = ecmHost + '/alfresco/aos/' + '_aos_nodeid' + '/' + node.id + '/' + node.name;
    }
    return url;
  }

  private aos_tryToLaunchOfficeByMsProtocolHandler(protocolHandler: string, url: string) {
    let protocolUrl = protocolHandler + ':ofe%7Cu%7C' + url;
    let protocolHandlerPresent = false;

    let input = document.createElement('input');
    let inputTop = document.body.scrollTop + 10;
    input.setAttribute('style', 'z-index: 1000; background-color: rgba(0, 0, 0, 0); border: none; outline: none; position: absolute; left: 10px; top: ' + inputTop + 'px;');
    document.getElementsByTagName('body')[0].appendChild(input);
    input.focus();
    input.onblur = function() {
      protocolHandlerPresent = true;
    };
    location.href = protocolUrl;
    let that = this;
    setTimeout(function() {
      input.onblur = null;
      input.remove();
      if (!protocolHandlerPresent) {
          let message: any = that.translationService.get('AOS.ERROR.UNSUPPORTED_CLIENT_VERSION');
          that.notificationService.openSnackMessage(message.value, 3000);
      }
    }, 500);
  }

}
