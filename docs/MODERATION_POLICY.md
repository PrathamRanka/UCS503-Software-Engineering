# Moderation Policy

## Goals

Protect members from sexual content, exploitation, threats, graphic violence, harassment, hate, scams, malware, and privacy violations while minimizing unnecessary censorship and moderator access to private material.

Automated classifiers provide evidence; they do not determine guilt, permanently ban users, or replace human judgment.

## Pipeline

1. Validate extension, MIME signature, checksum, dimensions, duration, and size.
2. Scan every uploaded file with ClamAV.
3. Extract representative video frames and audio.
4. Run visual NSFW/violence classification.
5. Run OCR and text toxicity classification.
6. Transcribe speech where audio exists and scan the transcript.
7. Combine findings through the policy engine.
8. Publish, hold for review, or reject.
9. Preserve minimal evidence and an auditable explanation.

## Decision thresholds

Thresholds are configuration, versioned as `moderation-policy-v1`, and calibrated against a documented test set.

| Result | Rule | Action |
| --- | --- | --- |
| Allow | All restricted-category scores below 0.35 and no deterministic violation | Publish automatically |
| Review | Any score from 0.35 through 0.84, conflicting classifiers, OCR uncertainty, or model failure | Keep private and queue for human review |
| Reject | Explicit sexual/graphic category at or above 0.85, malware detected, or prohibited file | Reject publication and permit appeal |
| Critical escalation | Suspected exploitation, credible violence threat, or exposed highly sensitive personal data | Restrict access to super-admin review and follow approved institutional process |

Thresholds are starting values, not claims of universal accuracy. No user is automatically banned solely from a model score.

## Text policy

The platform rejects direct threats, targeted slurs, sexual solicitation, doxxing, credential theft, and repeated targeted harassment. Profanity alone is not automatically a violation. Quoted or educational context receives human review when confidence is uncertain.

## Private messages

- Text and media are scanned before delivery.
- Moderators cannot browse conversations.
- A participant report reveals the selected message and at most five messages before and after it, unless a super admin records a reason for expanded context.
- Moderator access is written to the audit log.

## Case workflow

```text
open -> assigned -> reviewing -> decided -> appealed -> appeal_decided -> closed
```

Admins may approve content, reject content, issue warnings, and apply temporary suspensions up to seven days. Super admins handle longer suspensions, permanent bans, critical escalation, and admin misconduct.

## Appeals

- Members may appeal a content rejection or suspension once within seven days.
- A different moderator reviews the appeal where staffing allows.
- The appeal decision includes a policy category and plain-language reason.
- Repeated abusive appeals may be rate-limited but remain auditable.

## Model governance

- Record provider/model name, model version, policy version, category scores, processing time, and final action.
- Maintain a balanced evaluation set containing safe campus scenes, sports, skin exposure without sexual context, text screenshots, and actual violations.
- Measure false-positive and false-negative rates before changing thresholds.
- Changing a model or threshold requires regression evaluation and an ADR entry.
