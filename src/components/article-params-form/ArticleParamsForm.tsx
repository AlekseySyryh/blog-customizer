import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

type ArticleParamsFormProps = {
	currentArticleState: ArticleStateType;
	setCurrentArticleState: (newCurrentArticleState: ArticleStateType) => void;
};

export const ArticleParamsForm = (props: ArticleParamsFormProps) => {
	const [formVisible, setFormVisible] = useState<boolean>(false);
	const [editedArticleState, setEditedArticleState] =
		useState<ArticleStateType>({
			...props.currentArticleState,
		});

	const popupRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!formVisible) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setFormVisible(false);
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (popupRef.current && !popupRef.current.contains(target)) {
				setFormVisible(false);
			}
		};

		document.addEventListener('keydown', handleEscape);
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [formVisible]);

	const onArrowClick = () => {
		setFormVisible(!formVisible);
	};

	const updateFormField = (field: keyof ArticleStateType) => {
		return (value: OptionType) => {
			setEditedArticleState({ ...editedArticleState, [field]: value });
		};
	};

	const onSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		setFormVisible(false);
		props.setCurrentArticleState(editedArticleState);
	};

	const onReset = () => {
		setFormVisible(false);
		setEditedArticleState(defaultArticleState);
		props.setCurrentArticleState(defaultArticleState);
	};

	return (
		<>
			<ArrowButton isOpen={formVisible} onClick={onArrowClick} />
			<aside
				ref={popupRef}
				className={clsx(styles.container, {
					[styles.container_open]: formVisible,
				})}>
				<form className={styles.form} onSubmit={onSubmit} onReset={onReset}>
					<Text as={'h2'} uppercase weight={800} size={31}>
						Задайте параметры
					</Text>
					<Select
						options={fontFamilyOptions}
						selected={editedArticleState.fontFamilyOption}
						title='Шрифт'
						onChange={updateFormField('fontFamilyOption')}
					/>
					<RadioGroup
						options={fontSizeOptions}
						selected={editedArticleState.fontSizeOption}
						title='Размер шрифта'
						name='fontsize'
						onChange={updateFormField('fontSizeOption')}
					/>
					<Select
						options={fontColors}
						selected={editedArticleState.fontColor}
						title='Цвет шрифта'
						onChange={updateFormField('fontColor')}
					/>
					<Separator />
					<Select
						options={backgroundColors}
						selected={editedArticleState.backgroundColor}
						title='Цвет фона'
						onChange={updateFormField('backgroundColor')}
					/>
					<Select
						options={contentWidthArr}
						selected={editedArticleState.contentWidth}
						title='Ширина контента'
						onChange={updateFormField('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
