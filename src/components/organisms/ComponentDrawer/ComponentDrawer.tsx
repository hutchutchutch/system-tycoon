import React, { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Input } from '../../atoms/Input';
import { ComponentCard } from '../../molecules/ComponentCard';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import type { 
  ComponentDrawerProps, 
  DrawerComponent, 
  ComponentOffering,
  DetailedComponentView 
} from './ComponentDrawer.types';
import styles from './ComponentDrawer.module.css';

export const ComponentDrawer: React.FC<ComponentDrawerProps> = ({
  components,
  categories,
  searchQuery,
  selectedComponent,
  expandedComponent,
  userProgress = { completedMissions: [], unlockedConcepts: [], level: 1 },
  onSearchChange,
  onComponentSelect,
  onComponentExpand,
  onOfferingDragStart,
  onOfferingDragEnd,
  getDetailedView,
  checkSelectionRules,
  className,
}) => {
  // Local state for category expansion
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.id))
  );
  
  // State for drawer collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return components;
    
    const query = searchQuery.toLowerCase();
    return components.filter(component => 
      component.name.toLowerCase().includes(query) ||
      component.shortDescription.toLowerCase().includes(query) ||
      component.category.toLowerCase().includes(query)
    );
  }, [components, searchQuery]);

  // Group filtered components by category
  const groupedComponents = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = filteredComponents.filter(
        component => component.category === category.id
      );
      return acc;
    }, {} as Record<string, DrawerComponent[]>);
  }, [categories, filteredComponents]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const handleComponentClick = useCallback((component: DrawerComponent) => {
    if (expandedComponent === component.id) {
      // Collapse if already expanded
      onComponentExpand?.(component);
    } else {
      // Expand the component
      onComponentExpand?.(component);
      onComponentSelect?.(component);
    }
  }, [expandedComponent, onComponentExpand, onComponentSelect]);

  const handleOfferingDragStart = useCallback((
    event: React.DragEvent<HTMLDivElement>, 
    offering: ComponentOffering,
    component: DrawerComponent
  ) => {
    // Check if offering can be selected
    const selectionResult = checkSelectionRules?.(offering);
    
    if (selectionResult && !selectionResult.allowed) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.setData('application/reactflow', component.category);
    event.dataTransfer.setData('application/offering', JSON.stringify(offering));
    event.dataTransfer.setData('application/component', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
    
    onOfferingDragStart?.(offering, component);
  }, [checkSelectionRules, onOfferingDragStart]);

  // Handle dragging of drawer components directly
  const handleComponentDragStart = useCallback((
    event: React.DragEvent<HTMLDivElement>,
    component: DrawerComponent
  ) => {
    // Set drag data for the component
    event.dataTransfer.setData('application/reactflow', component.category);
    event.dataTransfer.setData('application/component', JSON.stringify({
      id: component.id,
      name: component.name,
      type: component.category,
      category: component.category,
      cost: 50, // Default cost
      capacity: 1000, // Default capacity
      description: component.shortDescription,
      icon: component.icon,
      color: component.color
    }));
    event.dataTransfer.effectAllowed = 'move';
    
    console.log('Dragging component:', component.name);
  }, []);

  const renderOffering = (
    offering: ComponentOffering, 
    component: DrawerComponent,
    vendorCategory: string
  ) => {
    const selectionResult = checkSelectionRules?.(offering);
    const isLocked = selectionResult ? !selectionResult.allowed : !offering.initially_selectable;
    const isUnlocked = !isLocked || userProgress.completedMissions.includes(offering.unlockConditions?.mission || '');

    return (
      <div
        key={offering.id}
        className={clsx(
          styles.offering,
          isLocked && styles['offering--locked'],
          isUnlocked && styles['offering--unlocked']
        )}
        draggable={!isLocked}
        onDragStart={(e) => handleOfferingDragStart(e, offering, component)}
        onDragEnd={onOfferingDragEnd}
      >
        <div className={styles.offeringHeader}>
          <div className={styles.offeringInfo}>
            <h5 className={styles.offeringName}>{offering.name}</h5>
            <span className={styles.offeringVendor}>{offering.vendor}</span>
          </div>
          {isLocked && (
            <Icon name="lock" size="sm" className={styles.lockIcon} />
          )}
        </div>
        
        <p className={styles.offeringDescription}>{offering.description}</p>
        
        <div className={styles.offeringSpecs}>
          {Object.entries(offering.specs).slice(0, 3).map(([key, value]) => value && (
            <Badge key={key} variant="outline" size="sm">
              {key}: {value}
            </Badge>
          ))}
        </div>
        
        <div className={styles.offeringFooter}>
          <span className={styles.offeringPricing}>{offering.pricing}</span>
          {isLocked && selectionResult?.message && (
            <span className={styles.unlockHint}>{selectionResult.message}</span>
          )}
        </div>
      </div>
    );
  };

  const renderDetailedView = (component: DrawerComponent) => {
    const detailedView = getDetailedView?.(component.id);
    if (!detailedView) return null;

    return (
      <div className={styles.detailedView}>
        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Overview</h4>
          <p className={styles.sectionDescription}>{detailedView.sections.overview.description}</p>
          
          <div className={styles.conceptList}>
            <h5>Key Concepts:</h5>
            <ul>
              {detailedView.sections.overview.concepts.map(concept => (
                <li key={concept}>{concept}</li>
              ))}
            </ul>
          </div>
          
          <div className={styles.useCaseList}>
            <h5>Common Use Cases:</h5>
            <ul>
              {detailedView.sections.overview.useCases.map(useCase => (
                <li key={useCase}>{useCase}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Available Implementations</h4>
          
          {Object.entries(detailedView.sections.implementations).map(([category, offerings]) => (
            offerings.length > 0 && (
              <div key={category} className={styles.vendorCategory}>
                <h5 className={styles.vendorCategoryTitle}>
                  {category === 'cloud' && '☁️ Cloud Providers'}
                  {category === 'selfHosted' && '🏠 Self-Hosted'}
                  {category === 'enthusiast' && '🔧 DIY / Enthusiast'}
                </h5>
                <div className={styles.offeringGrid}>
                  {offerings.map(offering => renderOffering(offering, component, category))}
                </div>
              </div>
            )
          ))}
        </div>

        <div className={styles.detailSection}>
          <h4 className={styles.sectionTitle}>Guidance</h4>
          <div className={styles.guidanceContent}>
            <p><strong>When to use:</strong> {detailedView.sections.guidance.whenToUse}</p>
            
            {detailedView.sections.guidance.alternatives.length > 0 && (
              <div className={styles.alternatives}>
                <strong>Consider alternatives:</strong>
                <div className={styles.alternativeList}>
                  {detailedView.sections.guidance.alternatives.map(alt => (
                    <Button
                      key={alt.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleComponentClick(alt)}
                    >
                      {alt.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {detailedView.sections.guidance.nextSteps.length > 0 && (
              <div className={styles.nextSteps}>
                <strong>Next steps:</strong>
                <ul>
                  {detailedView.sections.guidance.nextSteps.map(step => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={clsx(styles.drawer, isCollapsed && styles.collapsed, className)}>
      <div className={styles.header}>
        {!isCollapsed && <h2 className={styles.title}>Components</h2>}
        <button
          className={styles.collapseToggle}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand component drawer" : "Collapse component drawer"}
        >
          <Icon name={isCollapsed ? "chevron-right" : "chevron-left"} size="sm" />
        </button>
        {!isCollapsed && (
          <Input
            type="search"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search components..."
            leftIcon={<Icon name="search" size="sm" />}
            className={styles.search}
            aria-label="Search components"
          />
        )}
      </div>

      {!isCollapsed && (
        <div className={styles.categories}>
          {categories.map(category => {
          const categoryComponents = groupedComponents[category.id] || [];
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id} className={styles.category}>
              <button
                className={styles.categoryHeader}
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`category-${category.id}`}
              >
                <Icon name={category.icon as any} size="md" />
                <span className={styles.categoryTitle}>{category.name}</span>
                <span className={styles.categoryCount}>
                  {categoryComponents.length}
                </span>
                <Icon 
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  className={clsx(
                    styles.chevron,
                    isExpanded && styles['chevron--expanded']
                  )}
                  size="sm"
                />
              </button>
              
              {isExpanded && (
                <div 
                  id={`category-${category.id}`}
                  className={styles.categoryItems}
                >
                  {categoryComponents.length === 0 ? (
                    <p className={styles.emptyMessage}>
                      No components found
                    </p>
                  ) : (
                    categoryComponents.map(component => (
                      <div key={component.id} className={styles.componentWrapper}>
                        <ComponentCard
                          drawerComponent={component}
                          variant="drawer"
                          isExpanded={expandedComponent === component.id}
                          onClick={() => handleComponentClick(component)}
                          onDragStart={(event) => handleComponentDragStart(event as React.DragEvent<HTMLDivElement>, component)}
                          onDragEnd={onOfferingDragEnd}
                        />
                        {expandedComponent === component.id && renderDetailedView(component)}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};