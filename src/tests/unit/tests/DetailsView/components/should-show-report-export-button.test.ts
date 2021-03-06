// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { ScanData, VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import {
    CommandBarProps,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import {
    shouldShowReportExportButtonForAssessment,
    shouldShowReportExportButtonForFastpass,
} from 'DetailsView/components/should-show-report-export-button';
import { IMock, Mock } from 'typemoq';

describe('ShouldShowReportExportButton', () => {
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let visualizationConfigurationMock: IMock<VisualizationConfiguration>;

    const visualizationStoreData = { tests: {} } as VisualizationStoreData;
    const unifiedScanResultStoreData = {} as UnifiedScanResultStoreData;
    const scanData = {} as ScanData;
    const selectedTest = -1;

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationConfigurationMock = Mock.ofType<VisualizationConfiguration>();
        visualizationConfigurationFactoryMock
            .setup(m => m.getConfiguration(selectedTest))
            .returns(() => visualizationConfigurationMock.object);
    });

    function getProps(): DetailsViewCommandBarProps {
        return {
            visualizationStoreData: visualizationStoreData,
            unifiedScanResultStoreData: unifiedScanResultStoreData,
            visualizationConfigurationFactory: visualizationConfigurationFactoryMock.object,
            selectedTest: selectedTest,
            deps: null,
            featureFlagStoreData: null,
            tabStoreData: null,
            assessmentStoreData: null,
            assessmentsProvider: null,
            rightPanelConfiguration: null,
            cardsViewData: null,
            switcherNavConfiguration: null,
            scanMetadata: null,
            narrowModeStatus: null,
        } as DetailsViewCommandBarProps;
    }

    function setupVisualizationConfigurationMock(shouldShow: boolean, enabled: boolean): void {
        visualizationConfigurationMock
            .setup(m => m.getStoreData(visualizationStoreData.tests))
            .returns(() => scanData);
        visualizationConfigurationMock.setup(m => m.getTestStatus(scanData)).returns(() => enabled);
        visualizationConfigurationMock
            .setup(m => m.shouldShowExportReport(unifiedScanResultStoreData))
            .returns(() => shouldShow);
    }

    describe('shouldShowReportExportButtonForAssessment', () => {
        test('returns true', () => {
            const props = {} as CommandBarProps;
            const shouldShowButton = shouldShowReportExportButtonForAssessment(props);

            expect(shouldShowButton).toBe(true);
        });
    });

    describe('shouldShowReportExportButtonForFastpass', () => {
        test('returns false if shouldShow is false, test is not enabled', () => {
            setupVisualizationConfigurationMock(false, false);
            const props = getProps();
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);
            expect(shouldShowButton).toBe(false);
        });

        test('returns false if shouldShow is false, test is enabled', () => {
            setupVisualizationConfigurationMock(false, true);
            const props = getProps();
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);
            expect(shouldShowButton).toBe(false);
        });

        test('returns false if shouldShow is true, test is not enabled', () => {
            setupVisualizationConfigurationMock(true, false);
            const props = getProps();
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);
            expect(shouldShowButton).toBe(false);
        });

        test('returns true if shouldShow is true, test is enabled', () => {
            setupVisualizationConfigurationMock(true, true);
            const props = getProps();
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);
            expect(shouldShowButton).toBe(true);
        });
    });
});
