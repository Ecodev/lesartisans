#!/bin/sh

pass=true

files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts)$' | xargs printf -- '--files=%s\n')
if [ "$files" != "--files=" ]; then

    # Run TypeScript syntax check before commit
    echo "$files" | xargs ./node_modules/.bin/ng lint artisans --
    if [ $? -ne 0 ]; then
        pass=false
    fi
fi

files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(php|phtml)$')
if [ "$files" != "" ]; then

    # Run php syntax check before commit
    for file in ${files}; do
        php -l ${file}
        if [ $? -ne 0 ]; then
            pass=false
        fi
    done

    # Run php-cs-fixer validation before commit
    echo "$files" | xargs php ./vendor/bin/php-cs-fixer fix --diff --config .php_cs.dist
    if [ $? -ne 0 ]; then
        pass=false
    fi

    # Automatically add files that may have been fixed by php-cs-fixer
    echo "$files" | xargs git add
fi


if $pass; then
    exit 0
else
    echo ""
    echo "PRE-COMMIT HOOK FAILED:"
    echo "Code style validation failed. Please fix errors and try committing again."
    exit 1
fi
