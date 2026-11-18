/**
 * Keeps everything the QA tools create inside the project folder.
 *
 * Headless browsers write a temporary profile to the system temp directory by
 * default. Importing this module FIRST points that directory at `qa/tmp`, so
 * nothing is written outside the project.
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

/** `<project>/qa/tmp` */
export const LOCAL_TMP = join(here, '..', 'tmp')

mkdirSync(LOCAL_TMP, { recursive: true })
process.env.TEMP = LOCAL_TMP
process.env.TMP = LOCAL_TMP
process.env.TMPDIR = LOCAL_TMP
