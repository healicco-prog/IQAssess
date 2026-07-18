const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/BlueprintAssessor.tsx', 'utf-8');

code = code.replace('onClick={() => setBaShowRepositoryModal(false', 'onClick={() => setBaShowRepositoryModal(false)}');
code = code.replace('onChange={(e) => setBaSearchQuery(e.target.value', 'onChange={(e) => setBaSearchQuery(e.target.value)}');
code = code.replace('onClick={() => selectRepositoryBlueprint(bp', 'onClick={() => selectRepositoryBlueprint(bp)}');

// Fix `)` to `))}` for the map
code = code.replace(/\s*\)\r?\n\r?\n\s*\{filteredRepository\.length === 0/, '\n              ))}\n\n              {filteredRepository.length === 0');

// Fix closing condition for filteredRepository.length === 0
code = code.replace(/repository\.<\/p>\r?\n\s*<\/div>/, 'repository.</p>\n              )}\n            </div>');

// Fix closing condition for baShowRepositoryModal
code = code.replace(/<\/div>\r?\n\s*<\/div>\r?\n\s*\r?\n\s*<\/div>/, '</div>\n        </div>\n      )}\n\n    </div>');

fs.writeFileSync('frontend/src/components/BlueprintAssessor.tsx', code);
console.log('Fixed JSX syntax errors');
