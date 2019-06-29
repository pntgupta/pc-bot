/* eslint-disable */
const fs = require('fs');
const chalk = require('chalk');
const prompt = require('inquirer').createPromptModule();
const execSync = require('child_process').execSync;

const MAX_LENGTH = 100;
// Group 1 (TYPE) -> ([a-zA-Z]*)
// Group 2 (SCOPE) -> (\((.+?)\))?
// Connector -> \: ---> colon space
// Group 3 (DESCRIPTION) -> (.*)
const PATTERN = /^([a-zA-Z]*)(\((.+?)\))?\: (.*)$/;
const SCOPE_PATTERN = /^[\w\.\-\,]*$/;
const COMMIT_MSG_FILE = `${ __dirname.includes('node_modules') ? '../../' : '' }.git/COMMIT_EDITMSG`;
const ERROR_MSG_PREFIX = chalk.red('INVALID COMMIT MSG:');
const MENU_TITLE = chalk.cyan('You can commit using the following menu:');
// Why hash is needed?
// If user commits via npm, we need to manually trigger git commit. On doing so same file is executed again through git hooks (Yes, we want this to happen).
// We need to know if user committed via npm as in that case no warning messages will be shown. Since the commit message is the only parameter that is
// received by this file, we used a hash value as the commit message so that when next time this file is executed we can match if the commit message
// matches the hash. If yes, we assume that it was originally triggered via npm.
const HASH = '15198150120601519815047617';
const EXIT_TYPES = {
  SUCCESS: 'success',
  FAILURE: 'failure'
};
const TYPES = {
  feat: true,
  fix: true,
  docs: true,
  style: true,
  refactor: true,
  perf: true,
  test: true,
  chore: true,
  cleanup: true,
  revert: true,
  tracking: true
};
const QUESTION_SEQUENCE = {
  TYPE: 1,
  SCOPE: 2,
  DESCRIPTION: 3
};

/**
 * Root function
 * It checks if the commit occur by git or npm command
 */
function init() {
  // To handle Ctrl + C
  process.on('exit', type => {
    process.exit(type === EXIT_TYPES.SUCCESS ? EXIT_TYPES.SUCCESS : 1);
  });

  // If any argument is passed then it means it originated via git. This is because commit message file is passed by git as 2nd argument
  // In case of huskey, it cannot pass anything so we manually pass any agrument in package.json (-git in this case)
  process.argv[2] ? validateCommit() : gitCommit();
}

/**
 * It validates the commit message
 * If it's wrong then show the menu otherwise terminate process with success
 */
function validateCommit() {
  try {
    // Msg includes a blank new line, remove it
    const commitMsg = fs.readFileSync(COMMIT_MSG_FILE, 'utf8').trim();

    // If triggered via this file then commit message will be HASH, so don't show any errors
    if (commitMsg !== HASH) {
      validateMsg(commitMsg);
      process.emit('exit', EXIT_TYPES.SUCCESS);
    } else {
      showMenu();
    }
  } catch ({ errors, values }) {
    console.log('ERRORS', errors);

    const invalidQuestions = [];
    console.log(`\n${ERROR_MSG_PREFIX}`);

    // Console all the errors found sequentially
    errors.forEach((err, index) => {
      if (err.question) {
        invalidQuestions.push(err.question);
      }
      console.log(`(${index + 1}) ${err.msg}`);
    });

    console.log(`\n${MENU_TITLE}\n`);
    showMenu(invalidQuestions, values);
  }
}

/**
 * Validates all the parts of commit message i.e. "type(scope): description"
 * @param {string} commitMsg
 *
 * If this function executes completely then it means the message entered is fine.
 * If it throws error then something is wrong.
 */
function validateMsg(commitMsg) {
  const match = PATTERN.exec(commitMsg);
  const errors = [];

  if (match) {
    const type = match[1];
    const scope = match[3];
    const description = match[4];

    // Identify all the errors so that we can show all the corresponding questions in the menu
    const isValidMsgType = validateMsgType(type);
    const isValidMsgScope = validateMsgScope(scope);
    const isValidMsgLength = validateMsgLength(description);

    if (isValidMsgType !== true) {
      errors.push({ question: QUESTION_SEQUENCE.TYPE, msg: isValidMsgType });
    }
    if (isValidMsgScope !== true) {
      errors.push({ question: QUESTION_SEQUENCE.SCOPE, msg: isValidMsgScope });
    }
    if (isValidMsgLength !== true) {
      errors.push({
        question: QUESTION_SEQUENCE.DESCRIPTION,
        msg: isValidMsgLength
      });
    }
    if (errors.length) {
      throw { errors, values: { type, scope, description } };
    }
  } else {
    throw {
      errors: [
        {
          msg: `${chalk.cyan(
            'Expected:'
          )} <type>(<scope>): <description> \t${chalk.cyan(
            'Received:'
          )} ${commitMsg}`
        }
      ]
    };
  }
}

/**
 * Validates that the 'type' entered is allowed
 * @param {string} type
 *
 * @return {true | string} Since same functions are used as validators in inquirer as well, it's mandatory to return true if validation pass
 * otherwise return the error message.
 */
function validateMsgType(type) {
  return TYPES[type] || `'${type}' is not allowed type!`;
}

/**
 * Validates the scope
 * @param {string} scope
 *
 * @return {true | string}
 */
function validateMsgScope(scope) {
  if (scope.length === 0 && scope.trim().length === 0) {
    return 'The value cannot be empty or blank.';
  }
  return SCOPE_PATTERN.test(scope)
    ? true
    : `Invalid characters in commit scope '${scope}', allowed characters are number, alphabet, dot(.), hyphen(-), comma(,).`;
}

/**
 * Validates the description message
 * @param {string} description
 *
 * @return {true | string}
 */
function validateMsgLength(description) {
  const length = description.length;
  return (
    (length > 0 && length <= MAX_LENGTH) ||
    `Expected length to be more than 0 and upto ${MAX_LENGTH} but got ${length}.`
  );
}

/**
 * Shows the commit menu to the user
 * @param {Array<number>} invalidQuestions An Array which stores the question number that needs to be asked again as corresponding
 *  values were entered wrong in the commit message.
 *  @example [2,3]
 * @param {Object} preFilledValues Suppose 'type' and 'scope' were entered correctly, then only 3rd question needs to be asked again.
 *  In that case we need to reuse the values of 'type' and 'scope'.
 *  @example { type: 'foo', scope: 'bar', description: 'baz' }
 *
 */
function showMenu(invalidQuestions = [], preFilledValues = {}) {
  const questions = [
    {
      type: 'list',
      name: 'type',
      message: 'What type of commit is this?',
      choices: [
        'feat:      A new feature',
        'fix:       A bug fix',
        'style:     CSS Changes',
        'cleanup:   Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, dead code removal etc.)',
        'refactor:  A code change that neither fixes a bug nor adds a feature but is used for restructuring the code',
        'perf:      A code change that improves performance',
        'test:      Adding missing tests or fixing them',
        'chore:     Changes to the build process or auxiliary tools and libraries such as documentation generation',
        'tracking:  Any kind of tracking which includes Bug Tracking, User Tracking, Anyalytics, AB-Testing etc',
        'docs:      Documentation only changes'
      ],
      filter(type) {
        return type.substr(0, type.indexOf(':'));
      }
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Enter the scope of the change:',
      validate(scope) {
        return validateMsgScope(scope);
      }
    },
    {
      type: 'input',
      name: 'description',
      message: `Enter the commit description ( Max length ${MAX_LENGTH}):`,
      validate(description) {
        return validateMsgLength(description);
      }
    }
  ];

  let questionsToShow = [];

  // If 'invalidQuestions' are there, then ask only those questions by pulling corresponding questions from above variable. Otherwise ask all!
  if (invalidQuestions.length) {
    invalidQuestions.forEach(questionNum => {
      questionsToShow.push(questions[questionNum - 1]);
    });
  } else {
    questionsToShow = questions;
  }

  return prompt(questionsToShow)
    .then(answers => {
      const msg = `${answers.type || preFilledValues.type}(${answers.scope ||
        preFilledValues.scope}): ${answers.description ||
        preFilledValues.description}`;

      // Need to write back the new commit message to git file.
      fs.writeFileSync(COMMIT_MSG_FILE, msg, 'utf8');
      process.emit('exit', EXIT_TYPES.SUCCESS);
    })
    .catch(err => {
      process.emit('exit', EXIT_TYPES.FAILURE);
    });
}

/**
 * In case triggered from npm then we need to manually do git commit
 * Doing this in beginning instead of end so that the default validations of git can run at start like
 * check if there is any staged file or not. If not show error!
 */
function gitCommit() {
  try {
    execSync(`git commit -m "${HASH}"`, { stdio: [0, 1, 2] });
    process.emit('exit', EXIT_TYPES.SUCCESS);
  } catch (e) {
    // If no staged changes then show default git error not ours.
  }
}

init();
