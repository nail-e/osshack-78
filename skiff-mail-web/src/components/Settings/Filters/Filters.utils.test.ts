import * as skiffCrypto from 'skiff-crypto';
import { AddressObjectWithDisplayPicture } from 'skiff-front-utils';
import {
  CreateMailFilterInput,
  SystemLabels,
  ActionType as ActionTypeGraphQL,
  FilterType as FilterTypeGraphQL,
  FilterField as FilterFieldGraphQL,
  MailFilterField as MailFilterFieldGraphQL,
  MailFilter as MailFilterGraphQL
} from 'skiff-graphql';
import { v4 } from 'uuid';

import { createUserLabelFolder, createUserLabelPlain } from '../../../../tests/testUtils/userLabelTestUtils';
import { LABEL_TO_SYSTEM_LABEL, UserLabelFolder, UserLabelPlain } from '../../../utils/label';

import { ConditionType, ConditionComparator } from './Filters.constants';
import { Condition } from './Filters.types';
import { conditionsFromFilterGraphQL, createCreateMailFilterInput, filterFromGraphQL } from './Filters.utils';

// MOCKS
jest.mock('skiff-crypto', () => ({
  __esModule: true,
  encryptSessionKey: () => ({ encryptedKey: '', encryptedBy: { key: '' } }),
  encryptDatagramV2: jest.fn(),
  decryptDatagramV2: jest.fn(),
  generateSymmetricKey: jest.fn()
}));

jest.mock('skiff-front-utils', () => ({
  __esModule: true,
  requireCurrentUserData: () => ({
    userID: 'id',
    username: '1@skiff.com',
    privateUserData: {
      privateKey: 'privateKey'
    }
  })
}));

jest.mock('../../../crypto/filters', () => ({
  SubjectTextDatagram: 'SubjectTextDatagram',
  BodyTextDatagram: 'BodyTextDatagram'
}));

describe('createCreateMailFilterInput', () => {
  it('returns undefined if we do not provide at least one action', () => {
    const conditions = [
      {
        id: `${ConditionType.From}-${ConditionComparator.Is}`,
        type: ConditionType.From,
        comparator: ConditionComparator.Is,
        value: 'test@skiff.com'
      }
    ];
    // No actions are passed in -- no moveToOption, markAsRead, or labels
    const result = createCreateMailFilterInput(conditions, false);
    expect(result).toBeUndefined();
  });

  it('returns undefined if we do not provide at least one condition', () => {
    const conditions: Condition[] = [];
    const moveToOption: UserLabelFolder = createUserLabelFolder(v4(), 'folder');
    const result = createCreateMailFilterInput(conditions, false, moveToOption);
    expect(result).toBeUndefined();
  });

  it('should create a filter with "AND" filters by default', () => {
    const conditions = [
      {
        id: `${ConditionType.From}-${ConditionComparator.Is}`,
        type: ConditionType.From,
        comparator: ConditionComparator.Is,
        value: 'test@skiff.com'
      },
      {
        id: `${ConditionType.To}-${ConditionComparator.IsNot}`,
        type: ConditionType.To,
        comparator: ConditionComparator.IsNot,
        value: 'test2@skiff.com'
      }
    ];
    const moveToOption: UserLabelFolder = createUserLabelFolder(v4(), 'folder');
    const result = createCreateMailFilterInput(conditions, false, moveToOption);
    expect(result?.filter.filterType).toBe(FilterTypeGraphQL.And);
  });

  it('should create a filter with "OR" filters when shouldORFilters is true', () => {
    const conditions = [
      {
        id: `${ConditionType.From}-${ConditionComparator.Is}`,
        type: ConditionType.From,
        comparator: ConditionComparator.Is,
        value: 'test@skiff.com'
      },
      {
        id: `${ConditionType.To}-${ConditionComparator.IsNot}`,
        type: ConditionType.To,
        comparator: ConditionComparator.IsNot,
        value: 'test2@skiff.com'
      }
    ];
    const moveToOption: UserLabelFolder = createUserLabelFolder(v4(), 'folder');
    const result = createCreateMailFilterInput(conditions, true, moveToOption);
    expect(result?.filter.filterType).toBe(FilterTypeGraphQL.Or);
  });

  it('should create a filter with a "Move To" action when a folder is provided', () => {
    const conditions = [
      {
        id: `${ConditionType.To}-${ConditionComparator.Is}`,
        type: ConditionType.To,
        comparator: ConditionComparator.Is,
        value: 'test@skiff.com'
      }
    ];
    const folderID = v4();
    const folder: UserLabelFolder = createUserLabelFolder(folderID, 'folder');
    const result = createCreateMailFilterInput(conditions, false, folder);
    expect(result?.actions).toEqual([{ actionType: ActionTypeGraphQL.ApplyLabel, serializedData: folderID }]);
  });

  it('should create a filter with a "Move To" action when a system label is provided', () => {
    const conditions = [
      {
        id: `${ConditionType.To}-${ConditionComparator.Is}`,
        type: ConditionType.To,
        comparator: ConditionComparator.Is,
        value: 'test@skiff.com'
      }
    ];
    const spamSystemLabel = LABEL_TO_SYSTEM_LABEL[SystemLabels.Spam];
    const result = createCreateMailFilterInput(conditions, false, spamSystemLabel);
    expect(result?.actions).toEqual([
      { actionType: ActionTypeGraphQL.ApplySystemLabel, serializedData: spamSystemLabel.value }
    ]);
  });

  it('should create a filter with "Apply Label" actions when labels are provided', () => {
    const conditions = [
      {
        id: `${ConditionType.To}-${ConditionComparator.Is}`,
        type: ConditionType.To,
        comparator: ConditionComparator.Is,
        value: 'test@skiff.com'
      }
    ];

    const label1ID = v4();
    const label2ID = v4();
    const labels = [createUserLabelPlain(label1ID, 'label 1'), createUserLabelPlain(label2ID, 'label 2')];
    const result = createCreateMailFilterInput(conditions, false, undefined, labels);
    expect(result?.actions).toEqual(
      expect.arrayContaining([
        { actionType: ActionTypeGraphQL.ApplyLabel, serializedData: label1ID },
        { actionType: ActionTypeGraphQL.ApplyLabel, serializedData: label2ID }
      ])
    );
  });

  it('should create a filter with a "Mark As" action when markAs is provided', () => {
    const conditions = [
      {
        id: `${ConditionType.To}-${ConditionComparator.Is}`,
        type: ConditionType.To,
        comparator: ConditionComparator.Is,
        value: 'test@skiff.com'
      }
    ];

    const result = createCreateMailFilterInput(conditions, false, undefined, undefined, true);
    expect(result?.actions).toEqual([{ actionType: ActionTypeGraphQL.MarkAsRead }]);
  });

  it('should create a filter with "NOT" filters when a condition uses the "IsNot" comparator', () => {
    const fromAddress = 'test@skiff.com';
    const conditions = [
      {
        id: `${ConditionType.From}-${ConditionComparator.IsNot}`,
        type: ConditionType.From,
        comparator: ConditionComparator.IsNot,
        value: fromAddress
      }
    ];
    const moveToOption: UserLabelFolder = createUserLabelFolder(v4(), 'folder');
    const result = createCreateMailFilterInput(conditions, false, moveToOption);
    expect(result?.filter.subFilter).toEqual([
      {
        filterType: FilterTypeGraphQL.Not,
        subFilter: [
          {
            filterType: FilterTypeGraphQL.From,
            serializedData: fromAddress
          }
        ]
      }
    ]);
  });

  it('should create a filter with "CONTAINS" filters when a condition uses the "Includes" comparator', () => {
    const toPhrase = 'test';
    const conditions = [
      {
        id: `${ConditionType.To}-${ConditionComparator.Has}`,
        type: ConditionType.To,
        comparator: ConditionComparator.Has,
        value: toPhrase
      }
    ];
    const moveToOption: UserLabelFolder = createUserLabelFolder(v4(), 'folder');
    const result = createCreateMailFilterInput(conditions, false, moveToOption);
    expect(result?.filter.subFilter).toEqual([
      {
        filterType: FilterTypeGraphQL.Recipient,
        filterField: FilterFieldGraphQL.Contains,
        serializedData: toPhrase
      }
    ]);
  });

  it('createCreateMailFilterInput returns expected output with multiple conditions and actions', () => {
    const filterName = 'Filter';
    const fromAddress = 'test@skiff.com';
    const addressPhrase = 'skiff.com';
    const conditions: Condition[] = [
      {
        id: `${ConditionType.From}-${ConditionComparator.Is}`,
        type: ConditionType.From,
        comparator: ConditionComparator.Is,
        value: fromAddress
      },
      {
        id: `${ConditionType.To}-${ConditionComparator.Has}`,
        type: ConditionType.To,
        comparator: ConditionComparator.Has,
        value: addressPhrase
      }
    ];
    const label1ID = v4();
    const label2ID = v4();
    const labels: UserLabelPlain[] = [
      createUserLabelPlain(label1ID, 'label 1'),
      createUserLabelPlain(label2ID, 'label 2')
    ];
    const moveToOption = LABEL_TO_SYSTEM_LABEL[SystemLabels.Spam];

    const expected: CreateMailFilterInput = {
      actions: [
        { actionType: ActionTypeGraphQL.ApplyLabel, serializedData: label1ID },
        { actionType: ActionTypeGraphQL.ApplyLabel, serializedData: label2ID },
        { actionType: ActionTypeGraphQL.ApplySystemLabel, serializedData: moveToOption.value },
        { actionType: ActionTypeGraphQL.MarkAsRead },
        { actionType: ActionTypeGraphQL.DontNotify }
      ],
      filter: {
        filterType: FilterTypeGraphQL.And,
        subFilter: [
          { filterType: FilterTypeGraphQL.From, serializedData: fromAddress },
          {
            filterType: FilterTypeGraphQL.Recipient,
            filterField: FilterFieldGraphQL.Contains,
            serializedData: addressPhrase
          }
        ]
      },
      name: filterName,
      encryptedByKey: '',
      encryptedSessionKey: ''
    };

    expect(createCreateMailFilterInput(conditions, false, moveToOption, labels, true, true, filterName)).toEqual(
      expected
    );
  });

  it('createCreateMailFilterInput encrypts subject conditions', () => {
    const encryptedSubject = 'encryptedSubject';
    (skiffCrypto.encryptDatagramV2 as jest.Mock).mockReturnValue({ encryptedData: encryptedSubject });
    jest
      .spyOn(skiffCrypto, 'encryptSessionKey')
      .mockImplementation(() => ({ encryptedKey: 'encryptedKey', encryptedBy: { key: 'encryptedByKey' } }));

    const conditions: Condition[] = [
      {
        id: `${ConditionType.Subject}-${ConditionComparator.Has}`,
        type: ConditionType.Subject,
        comparator: ConditionComparator.Has,
        value: 'test subject'
      }
    ];

    const result = createCreateMailFilterInput(conditions, false, undefined, [], true);
    expect(result?.filter.subFilter).toEqual([
      {
        filterType: FilterTypeGraphQL.Subject,
        filterField: FilterFieldGraphQL.Contains,
        serializedData: encryptedSubject
      }
    ]);
  });

  it('createCreateMailFilterInput encrypts body conditions', () => {
    const encryptedBody = 'encryptedBody';
    (skiffCrypto.encryptDatagramV2 as jest.Mock).mockReturnValue({ encryptedData: encryptedBody });
    jest
      .spyOn(skiffCrypto, 'encryptSessionKey')
      .mockImplementation(() => ({ encryptedKey: 'encryptedKey', encryptedBy: { key: 'encryptedByKey' } }));

    const conditions: Condition[] = [
      {
        id: `${ConditionType.Body}-${ConditionComparator.Has}`,
        type: ConditionType.Body,
        comparator: ConditionComparator.Has,
        value: 'test body'
      }
    ];

    const result = createCreateMailFilterInput(conditions, false, undefined, [], true);
    expect(result?.filter.subFilter).toEqual([
      {
        filterType: FilterTypeGraphQL.Body,
        filterField: FilterFieldGraphQL.Contains,
        serializedData: encryptedBody
      }
    ]);
  });
});

describe('conditionsFromFilterGraphQL', () => {
  it('returns an array of conditions when passed valid subFilter and contacts', () => {
    const toContactEmail = 'testTo@skiff.com';
    const toContactDisplayName = 'Test To';
    const fromEmail = 'testFrom@skiff.com';
    const graphQLFilter: MailFilterFieldGraphQL = {
      filterType: FilterTypeGraphQL.And,
      subFilter: [
        {
          filterType: FilterTypeGraphQL.Not,
          subFilter: [
            {
              filterType: FilterTypeGraphQL.Recipient,
              serializedData: toContactEmail
            }
          ]
        },
        {
          filterType: FilterTypeGraphQL.From,
          serializedData: fromEmail
        }
      ]
    };
    const contacts: AddressObjectWithDisplayPicture[] = [{ name: toContactDisplayName, address: toContactEmail }];
    const result = conditionsFromFilterGraphQL(graphQLFilter, false, contacts);

    expect(result.length).toBe(2);
    const toCondition = result[0];
    const fromCondition = result[1];
    // Check the TO condition
    expect(toCondition?.type).toBe(ConditionType.To);
    expect(toCondition?.comparator).toBe(ConditionComparator.IsNot);
    expect(toCondition?.value).toEqual({
      label: toContactDisplayName,
      value: toContactEmail
    });
    // Check the FROM condition
    expect(fromCondition?.type).toBe(ConditionType.From);
    expect(fromCondition?.comparator).toBe(ConditionComparator.Is);
    // No contact for the from value, so the value is just a string
    expect(fromCondition?.value).toEqual(fromEmail);
  });

  it('returns an empty array when passed an empty subFilter', () => {
    const graphQLFilter = {
      filterType: FilterTypeGraphQL.Recipient,
      serializedData: 'test@example.com',
      subFilter: []
    };
    const result = conditionsFromFilterGraphQL(graphQLFilter, false, []);
    expect(result.length).toBe(0);
  });

  it('decrypts subject conditions', () => {
    const encryptedSubject = 'test subject';
    const decryptedSubject = 'test subject';
    (skiffCrypto.decryptDatagramV2 as jest.Mock).mockReturnValue({ body: { text: decryptedSubject } });

    const graphQLFilter: MailFilterFieldGraphQL = {
      filterType: FilterTypeGraphQL.And,
      subFilter: [
        {
          filterType: FilterTypeGraphQL.Subject,
          filterField: FilterFieldGraphQL.Contains,
          serializedData: encryptedSubject
        }
      ]
    };
    const result = conditionsFromFilterGraphQL(graphQLFilter, true, [], 'decryptedSessionKey');

    expect(result.length).toBe(1);
    const subjectCondition = result[0];
    expect(subjectCondition?.value).toEqual(decryptedSubject);
  });

  it('decrypts body conditions', () => {
    const encryptedBody = 'test body';
    const decryptedBody = 'test body';
    (skiffCrypto.decryptDatagramV2 as jest.Mock).mockReturnValue({ body: { text: decryptedBody } });

    const graphQLFilter: MailFilterFieldGraphQL = {
      filterType: FilterTypeGraphQL.And,
      subFilter: [
        {
          filterType: FilterTypeGraphQL.Body,
          filterField: FilterFieldGraphQL.Contains,
          serializedData: encryptedBody
        }
      ]
    };
    const result = conditionsFromFilterGraphQL(graphQLFilter, true, [], 'decryptedSessionKey');

    expect(result.length).toBe(1);
    const bodyCondition = result[0];
    expect(bodyCondition?.value).toEqual(decryptedBody);
  });
});

describe('filterFromGraphQL', () => {
  it('should convert a GraphQL filter to a Filter object', () => {
    const filterName = 'Filter';
    const toContactEmail = 'testTo@skiff.com';
    const toContactDisplayName = 'Test To';
    const fromPartialMatch = 'testFrom';
    const mailFilterID = v4();
    const archiveSystemLabel = SystemLabels.Archive;
    const graphqlFilter: MailFilterGraphQL = {
      filter: {
        filterType: FilterTypeGraphQL.Or,
        subFilter: [
          {
            filterType: FilterTypeGraphQL.Recipient,
            serializedData: toContactEmail
          },
          {
            filterType: FilterTypeGraphQL.From,
            filterField: FilterFieldGraphQL.Contains,
            serializedData: fromPartialMatch
          }
        ]
      },
      actions: [
        {
          actionType: ActionTypeGraphQL.ApplySystemLabel,
          serializedData: archiveSystemLabel
        }
      ],
      name: filterName,
      mailFilterID,
      clientside: false
    };
    const contacts: AddressObjectWithDisplayPicture[] = [{ name: toContactDisplayName, address: toContactEmail }];
    const filter = filterFromGraphQL(graphqlFilter, contacts);
    expect(filter?.id).toEqual(mailFilterID);
    expect(filter?.actions).toEqual([{ type: ActionTypeGraphQL.ApplySystemLabel, value: archiveSystemLabel }]);
    expect(filter?.conditions[0]?.type).toEqual(ConditionType.To);
    expect(filter?.conditions[0]?.comparator).toEqual(ConditionComparator.Is);
    expect(filter?.conditions[0]?.value).toEqual({
      label: toContactDisplayName,
      value: toContactEmail
    });
    expect(filter?.conditions[1]?.type).toEqual(ConditionType.From);
    expect(filter?.conditions[1]?.comparator).toEqual(ConditionComparator.Has);
    expect(filter?.conditions[1]?.value).toEqual(fromPartialMatch);
  });

  it('should return undefined if actions could not be parsed', () => {
    const graphqlFilter = {
      filter: {
        filterType: FilterTypeGraphQL.And,
        subFilter: [
          {
            filterType: FilterTypeGraphQL.From,
            serializedData: 'test@skiff.com'
          }
        ]
      },
      actions: [],
      mailFilterID: v4(),
      clientside: false
    };
    const filter = filterFromGraphQL(graphqlFilter, []);
    expect(filter).toBeUndefined();
  });

  it('should return undefined if conditions could not be parsed', () => {
    const graphqlFilter = {
      filter: {
        filterType: FilterTypeGraphQL.And,
        subFilter: []
      },
      actions: [
        {
          actionType: ActionTypeGraphQL.ApplyLabel,
          serializedData: v4()
        }
      ],
      mailFilterID: v4(),
      clientside: false
    };
    const filter = filterFromGraphQL(graphqlFilter, []);
    expect(filter).toBeUndefined();
  });

  it('should return undefined if keys are not given for a clientside filter', () => {
    const graphqlFilter = {
      filter: {
        filterType: FilterTypeGraphQL.And,
        subFilter: []
      },
      actions: [
        {
          actionType: ActionTypeGraphQL.ApplyLabel,
          serializedData: v4()
        }
      ],
      mailFilterID: v4(),
      clientside: true
    };
    const filter = filterFromGraphQL(graphqlFilter, []);
    expect(filter).toBeUndefined();
  });
});
