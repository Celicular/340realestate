import { runMigration } from './migrateBlogsToFirestore.js';

// Run the migration
runMigration()
  .then((results) => {
    console.log('\n✅ Migration process completed!');
    console.log('Results:', results);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });