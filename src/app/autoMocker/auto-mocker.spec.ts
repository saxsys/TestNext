/**
 * Created by Paule on 20.04.2017.
 */

import {TestBed, async} from '@angular/core/testing';
import {AutoMocker} from './auto-mocker';

describe('AutoMocker', () => {

  it('should init', async(() => {
    const autoMocker = new AutoMocker();
    expect(autoMocker).not.toBeNull();
  }));



});
