import { SampleScenario } from '../types/veris.js';

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'aws-credits',
    title: 'AWS challenge credit reward',
    category: 'Competition Reward',
    badge: 'Scenario A',
    messageText:
      'Congratulations on completing the AWS DeepRacer challenge! Your $100 promotional credits have been applied directly to your AWS account. You can view your updated credit balance under Credits in the AWS Billing & Cost Management Console. Thank you for participating!',
    description:
      'Plausible cloud competition reward with direct account credit and no password or fee demands.',
  },
  {
    id: 'job-interview',
    title: 'Frontend engineer interview invite',
    category: 'Job Opportunity',
    badge: 'Scenario B',
    messageText:
      'Hi Alex, thank you for applying to the Frontend Engineer position at Acme Corp. We were impressed by your background and would like to invite you to a 30-minute introductory call next Tuesday. Please select a convenient time on our recruitment calendar: acme.careers/schedule. No equipment purchase or application fee is required.',
    description:
      'Professional interview invitation referencing a submitted role with standard scheduling.',
  },
  {
    id: 'emergency',
    title: 'Urgent emergency claim',
    category: 'Impersonation & Urgency',
    badge: 'Scenario C',
    messageText:
      "Please send ₦20,000 to this account immediately. I'm at the hospital. My banking app is down, and I'll pay you back in an hour. Please don't delay.",
    description:
      'High-pressure emergency claim citing acute crisis and bypassing standard banking tools.',
  },
  {
    id: 'reminder',
    title: 'Dinner bill split reminder',
    category: 'Routine Communication',
    badge: 'Scenario D',
    messageText:
      'Hi Sarah, just a quick reminder about the split for dinner last night ($34.50). Whenever you get a chance this week, no rush at all. Thanks!',
    description:
      'Calm, low-urgency routine message with mutual context and no sensitive demands.',
  },
  {
    id: 'delivery-alert',
    title: 'Ambiguous package delivery alert',
    category: 'Delivery Notification',
    badge: 'Scenario E',
    messageText:
      'Courier Alert: Parcel #US-98240 could not be delivered to your registered address due to an incomplete house number. Please confirm your delivery preferences: courier-track-support.com/update.',
    description:
      'Ambiguous shipment alert requiring verification against your actual personal order records.',
  },
  {
    id: 'bvn',
    title: 'Urgent account suspension',
    category: 'Credential Harvesting',
    badge: 'Scenario F',
    messageText:
      "Dear customer, your bank account access will be suspended within 24 hours due to BVN discrepancy. Send your 11-digit BVN and mother's maiden name immediately to this support line to maintain account active.",
    description:
      'Coercive suspension threat directly harvesting high-sensitivity identity and banking verification data.',
  },
];
