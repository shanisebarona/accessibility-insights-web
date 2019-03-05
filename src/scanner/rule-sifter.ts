// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from '../views/content/content-page';
import { IDictionaryStringTo } from './dictionary-types';
import { isEmpty } from 'lodash';

export interface RuleInfo {
    id: string;
    enabled: boolean;
}

export interface RuleWithA11YCriteria {
    id: string;
    a11yCriteria: HyperlinkDefinition[];
}

export class RuleSifter {
    private readonly bestPracticeText = 'Best Practice';
    constructor(private ruleSet: RuleInfo[], private ruleToLinksMap: IDictionaryStringTo<HyperlinkDefinition[]>) {}

    public getSiftedRules(): RuleWithA11YCriteria[] {
        return this.ruleSet.reduce((filteredArray: RuleWithA11YCriteria[], rule: RuleInfo) => {
            const ruleToLinks = this.ruleToLinksMap[rule.id];

            if (!isEmpty(ruleToLinks) && rule.enabled && ruleToLinks.find(elem => elem.text === this.bestPracticeText) == null) {
                filteredArray.push({
                    id: rule.id,
                    a11yCriteria: ruleToLinks,
                });
            }

            return filteredArray;
        }, []);
    }
}
